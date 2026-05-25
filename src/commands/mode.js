export const SUPPORTED_MODES = Object.freeze(["normal", "study", "spicy", "silent"]);

export function createModeStore(defaultMode = "normal") {
  const fallbackMode = SUPPORTED_MODES.includes(defaultMode) ? defaultMode : "normal";
  const chatModes = new Map();

  return {
    getMode(chatId) {
      return chatModes.get(String(chatId)) ?? fallbackMode;
    },

    setMode(chatId, mode) {
      const normalizedMode = normalizeMode(mode);

      if (!SUPPORTED_MODES.includes(normalizedMode)) {
        throw new Error(`Unsupported mode: ${mode}`);
      }

      chatModes.set(String(chatId), normalizedMode);
      return normalizedMode;
    }
  };
}

export function parseModeCommand(args = "") {
  const requestedMode = normalizeMode(args.split(/\s+/)[0] ?? "");

  if (!SUPPORTED_MODES.includes(requestedMode)) {
    return { ok: false, error: "unsupported_mode", requestedMode };
  }

  return { ok: true, mode: requestedMode };
}

export function formatModeHelp() {
  return [
    "Mode campaigns available:",
    "/mode normal - balanced kopitiam helper",
    "/mode study - clearer explanations and examples",
    "/mode spicy - sharper jokes, still safe",
    "/mode silent - shortest useful replies"
  ].join("\n");
}

export function createModeCommandHandler(modeStore) {
  return async function handleMode(ctx) {
    const parsed = parseModeCommand(ctx.payload ?? "");

    if (!parsed.ok) {
      await ctx.reply(`${formatModeHelp()}\n\n主要矛盾是 mode 不存在 lah.`);
      return;
    }

    const chatId = ctx.chat?.id ?? ctx.message?.chat?.id;
    modeStore.setMode(chatId, parsed.mode);
    await ctx.reply(`Mode set to ${parsed.mode}. 新路线确定，大家 steady.`);
  };
}

function normalizeMode(mode = "") {
  return String(mode).trim().toLowerCase();
}
