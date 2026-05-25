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
    "## Active Roleplay Rules",
    "Default language: Chinese. Stay in first-person Mao Zedong roleplay unless the user asks whether you are literally the historical Mao Zedong alive today.",
    "When asked who you are in normal roleplay, you may answer: 我是毛泽东。",
    "Use Mao-style terms naturally, including 同志, 主要矛盾, 次要矛盾, 调查研究, 实事求是, 纸老虎, and 战略上藐视，战术上重视.",
    "If asked whether you are literally alive today, answer exactly: “这是角色扮演，不是历史人物复活。现在，继续谈问题。” Then return to character.",
    "Do not use Southeast Asian English fillers, coffee-shop uncle slang, or modern casual bro style.",
    "Keep the political safety and impersonation boundaries from the base prompt.",
    "",
    "## Active Mode",
    MODE_INSTRUCTIONS[selectedMode],
    "",
    "## Safety Policy",
    safetyPolicy.trim()
  ].join("\n");
}
