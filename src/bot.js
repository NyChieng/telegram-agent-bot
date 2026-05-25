import { Telegraf } from "telegraf";

import { createAskCommandHandler } from "./commands/ask.js";
import { createHelpCommandHandler, createStartCommandHandler } from "./commands/help.js";
import { createModeCommandHandler, createModeStore } from "./commands/mode.js";
import { buildSystemPrompt, loadPersonaPrompt } from "./persona/maoKopitiam.js";
import { checkSafety } from "./persona/safetyRules.js";
import { getMessageText, shouldHandleMessage, stripBotMention } from "./utils/messageFilter.js";
import { logger as defaultLogger } from "./utils/logger.js";

export async function createBot({ config, llmProvider, logger = defaultLogger }) {
  const bot = new Telegraf(config.telegramBotToken);
  const modeStore = createModeStore(config.defaultMode);
  const persona = await loadPersonaPrompt();
  const botInfo = await bot.telegram.getMe();

  async function answerQuestion(ctx, rawText) {
    const chatId = ctx.chat?.id ?? ctx.message?.chat?.id;
    const mode = modeStore.getMode(chatId);
    const safety = checkSafety(rawText);

    if (!safety.allowed) {
      await ctx.reply(safety.reply);
      return;
    }

    const systemPrompt = buildSystemPrompt({
      basePrompt: persona.basePrompt,
      safetyPolicy: persona.safetyPolicy,
      mode
    });

    await ctx.sendChatAction?.("typing");

    try {
      const reply = await llmProvider.generate({
        systemPrompt,
        prompt: rawText,
        metadata: {
          chatId,
          mode,
          username: ctx.from?.username ?? ctx.from?.first_name ?? "unknown"
        }
      });

      await ctx.reply(reply);
    } catch (error) {
      logger.error("LLM generation failed", { error: error.message });
      await ctx.reply("Aiyo, engine stalled. Send logs later, we continue the campaign.");
    }
  }

  bot.start(createStartCommandHandler());
  bot.help(createHelpCommandHandler());
  bot.command("ask", createAskCommandHandler(answerQuestion));
  bot.command("mode", createModeCommandHandler(modeStore));

  bot.on("message", async (ctx) => {
    const decision = shouldHandleMessage(ctx, botInfo);

    if (!decision.shouldHandle || decision.reason === "command" || decision.reason === "ask") {
      return;
    }

    const text = stripBotMention(getMessageText(ctx), botInfo.username);

    if (!text) {
      await ctx.reply("Aiyo, mention already but no question. Use /ask <message> lah.");
      return;
    }

    await answerQuestion(ctx, text);
  });

  bot.catch((error, ctx) => {
    logger.error("Telegram bot error", {
      error: error.message,
      updateId: ctx?.update?.update_id
    });
  });

  return bot;
}

export async function launchBot(bot, logger = defaultLogger) {
  await bot.launch();
  logger.info("Telegram bot launched");

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}
