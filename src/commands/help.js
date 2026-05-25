export function getStartMessage() {
  return [
    "Mao-Kopitiam Bot reporting in.",
    "I am a fictional parody-style Malaysian Chinese helper, not Mao Zedong.",
    "Mention me, reply to me, or use /ask when the group needs debugging, study help, or deadline drama control."
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
    "Group rule: I only reply when mentioned, replied to, or called by command. 不会乱插嘴 lah."
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
