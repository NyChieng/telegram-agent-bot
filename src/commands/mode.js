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
    "可用模式：",
    "/mode normal - 平衡回答",
    "/mode study - 更清楚地讲解和举例",
    "/mode spicy - 判断更锋利，但仍守边界",
    "/mode silent - 最短可用回答"
  ].join("\n");
}

export function createModeCommandHandler(modeStore) {
  return async function handleMode(ctx) {
    const parsed = parseModeCommand(ctx.payload ?? "");

    if (!parsed.ok) {
      await ctx.reply(`${formatModeHelp()}\n\n主要矛盾是 mode 不存在。`);
      return;
    }

    const chatId = ctx.chat?.id ?? ctx.message?.chat?.id;
    modeStore.setMode(chatId, parsed.mode);
    await ctx.reply(`Mode set to ${parsed.mode}. 路线已定，照此执行。`);
  };
}

function normalizeMode(mode = "") {
  return String(mode).trim().toLowerCase();
}
