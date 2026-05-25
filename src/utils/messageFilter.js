export const DEFAULT_SUPPORTED_COMMANDS = Object.freeze(["start", "help", "ask", "mode"]);

export function getMessageText(ctx) {
  return ctx?.message?.text ?? ctx?.message?.caption ?? "";
}

export function extractCommand(text = "") {
  const match = text.trim().match(/^\/([A-Za-z0-9_]+)(?:@([A-Za-z0-9_]+))?(?:\s+([\s\S]*))?$/);

  if (!match) {
    return null;
  }

  return {
    command: match[1].toLowerCase(),
    target: match[2] ?? null,
    args: (match[3] ?? "").trim()
  };
}

export function isCommandForThisBot(text, botInfo) {
  const parsed = extractCommand(text);

  if (!parsed) {
    return false;
  }

  if (!parsed.target) {
    return true;
  }

  if (!botInfo?.username) {
    return true;
  }

  return parsed.target.toLowerCase() === botInfo?.username?.toLowerCase();
}

export function isAskCommand(ctx, botInfo) {
  const text = getMessageText(ctx);
  const parsed = extractCommand(text);

  return parsed?.command === "ask" && isCommandForThisBot(text, botInfo);
}

export function isBotMentioned(ctx, botInfo) {
  const username = botInfo?.username;

  if (!username) {
    return false;
  }

  const text = getMessageText(ctx);
  return new RegExp(`(^|\\s)@${escapeRegExp(username)}\\b`, "i").test(text);
}

export function stripBotMention(text = "", username = "") {
  if (!username) {
    return text.trim();
  }

  return text.replace(new RegExp(`(^|\\s)@${escapeRegExp(username)}\\b`, "gi"), " ").trim();
}

export function isReplyToBot(ctx, botInfo) {
  const replyFrom = ctx?.message?.reply_to_message?.from;

  if (!replyFrom) {
    return false;
  }

  if (botInfo?.id && replyFrom.id === botInfo.id) {
    return true;
  }

  return Boolean(
    botInfo?.username &&
      replyFrom.username?.toLowerCase() === botInfo.username.toLowerCase()
  );
}

export function shouldHandleMessage(ctx, botInfo, supportedCommands = DEFAULT_SUPPORTED_COMMANDS) {
  const text = getMessageText(ctx);
  const parsed = extractCommand(text);

  if (parsed && isCommandForThisBot(text, botInfo)) {
    if (parsed.command === "ask") {
      return { shouldHandle: true, reason: "ask", command: parsed };
    }

    if (supportedCommands.includes(parsed.command)) {
      return { shouldHandle: true, reason: "command", command: parsed };
    }

    return { shouldHandle: false, reason: "unsupported_command", command: parsed };
  }

  if (isBotMentioned(ctx, botInfo)) {
    return { shouldHandle: true, reason: "mention" };
  }

  if (isReplyToBot(ctx, botInfo)) {
    return { shouldHandle: true, reason: "reply" };
  }

  if (ctx?.message?.chat?.type === "private" && text.trim()) {
    return { shouldHandle: true, reason: "private" };
  }

  return { shouldHandle: false, reason: "not_addressed" };
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
