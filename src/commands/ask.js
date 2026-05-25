import { extractCommand } from "../utils/messageFilter.js";

export function extractAskText(text = "") {
  const parsed = extractCommand(text);

  if (parsed?.command !== "ask") {
    return "";
  }

  return parsed.args;
}

export function formatAskUsage() {
  return "Use /ask <question or message>. 没有问题，就没有答案权.";
}

export function createAskCommandHandler(answerQuestion) {
  return async function handleAsk(ctx) {
    const text = extractAskText(ctx.message?.text ?? "");

    if (!text) {
      await ctx.reply(formatAskUsage());
      return;
    }

    await answerQuestion(ctx, text);
  };
}
