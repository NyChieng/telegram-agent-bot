import { Telegraf } from "telegraf";

import { createAskCommandHandler, extractAskText } from "./commands/ask.js";
import { createHelpCommandHandler, createStartCommandHandler } from "./commands/help.js";
import { createModeCommandHandler, createModeStore } from "./commands/mode.js";
import { buildSystemPrompt, loadPersonaPrompt } from "./persona/maoZedong.js";
import { checkSafety } from "./persona/safetyRules.js";
import { getMessageText, shouldHandleMessage, stripBotMention } from "./utils/messageFilter.js";
import { logger as defaultLogger } from "./utils/logger.js";
import { buildPhotoPrompt, getPhotoInputs, hasPhoto } from "./utils/photoInput.js";

export async function createBot({ config, llmProvider, logger = defaultLogger }) {
  const bot = new Telegraf(config.telegramBotToken);
  const modeStore = createModeStore(config.defaultMode);
  const persona = await loadPersonaPrompt();
  const botInfo = await bot.telegram.getMe();

  async function answerQuestion(ctx, rawText, options = {}) {
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
        images: options.images ?? [],
        metadata: {
          chatId,
          mode,
          username: ctx.from?.username ?? ctx.from?.first_name ?? "unknown"
        }
      });

      await ctx.reply(reply);
    } catch (error) {
      logger.error("LLM generation failed", { error: error.message });
      await ctx.reply(
        "同志们，模型引擎暂时卡住，主要矛盾在后端不是你。先把问题留着，我查明敌情再继续调查研究。"
      );
    }
  }

  bot.start(createStartCommandHandler());
  bot.help(createHelpCommandHandler());
  bot.command("ask", createAskCommandHandler(answerQuestion));
  bot.command("mode", createModeCommandHandler(modeStore));

  bot.on("message", async (ctx) => {
    const decision = shouldHandleMessage(ctx, botInfo);

    if (
      !decision.shouldHandle ||
      decision.reason === "command" ||
      (decision.reason === "ask" && !hasPhoto(ctx))
    ) {
      return;
    }

    const messageText = getMessageText(ctx);
    const text =
      decision.reason === "ask"
        ? extractAskText(messageText)
        : stripBotMention(messageText, botInfo.username);
    const images = await getPhotoInputs(ctx);

    if (!text && images.length === 0) {
      await ctx.reply("同志，问题还没有摆到桌面上。请用 /ask <message> 把问题说清楚。");
      return;
    }

    await answerQuestion(ctx, buildPhotoPrompt(text), { images });
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
