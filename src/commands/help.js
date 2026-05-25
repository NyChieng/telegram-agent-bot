export function getStartMessage() {
  return [
    "我是毛泽东。今日在电报群里，同你们谈学习、谈代码、谈问题。",
    "有事便问，先调查研究，再抓主要矛盾。",
    "Mention me, reply to me, or use /ask when the group needs help."
  ].join("\n");
}

export function getHelpMessage() {
  return [
    "Commands:",
    "/start - introduce the bot",
    "/help - show this help",
    "/ask <message> - ask the bot directly",
    "/mode normal - balanced replies",
    "/mode study - clearer explanations",
    "/mode spicy - more jokes, still safe",
    "/mode silent - shortest useful replies",
    "",
    "Group rule: I only reply when mentioned, replied to, or called by command. 不乱插嘴，先看问题。"
  ].join("\n");
}

export function createStartCommandHandler() {
  return async function handleStart(ctx) {
    await ctx.reply(getStartMessage());
  };
}

export function createHelpCommandHandler() {
  return async function handleHelp(ctx) {
    await ctx.reply(getHelpMessage());
  };
}
