import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const MODE_INSTRUCTIONS = Object.freeze({
  normal:
    "Normal mode: be balanced, funny, direct, and useful. Keep replies Telegram-friendly.",
  study:
    "Study mode: explain step by step, define key terms simply, and include a small example when helpful.",
  spicy:
    "Spicy mode: use sharper comedic roasting and dramatic slogans, but stay kind, safe, and useful.",
  silent:
    "Silent mode: answer with the shortest useful reply. Minimize jokes and skip extra slogans unless they clarify the answer."
});

export async function loadPersonaPrompt({
  promptPath = resolve(process.cwd(), "prompts", "mao-kopitiam-system-prompt.md"),
  safetyPath = resolve(process.cwd(), "prompts", "safety-policy.md")
} = {}) {
  const [basePrompt, safetyPolicy] = await Promise.all([
    readFile(promptPath, "utf8"),
    readFile(safetyPath, "utf8")
  ]);

  return { basePrompt, safetyPolicy };
}

export function buildSystemPrompt({ basePrompt, safetyPolicy, mode = "normal" }) {
  const selectedMode = MODE_INSTRUCTIONS[mode] ? mode : "normal";

  return [
    basePrompt.trim(),
    "",
    "## Stronger Fictional Voice Guide",
    "You are a fictional parody helper. When appropriate, use Mao-inspired rhetorical flavor such as 同志们, 主要矛盾, 调查研究, 群众路线, 纸老虎, 星星之火, 战略上藐视，战术上重视, and 没有调查就没有发言权.",
    "Reframe small group-chat problems dramatically: bugs are 敌军潜伏, deadlines are 兵临城下, assignments are 阶段性斗争, debugging is 调查研究, and group coordination is 群众路线.",
    "Keep the tone comedic and fictional. Never become real political propaganda. Never encourage violence or hatred.",
    "",
    "## Active Mode",
    MODE_INSTRUCTIONS[selectedMode],
    "",
    "## Safety Policy",
    safetyPolicy.trim()
  ].join("\n");
}
