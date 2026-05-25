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
  promptPath = resolve(process.cwd(), "prompts", "mao-zedong-system-prompt.md"),
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
    "Group Banter and Mock Political Accusations: treat casual accusations like “Kelvin 是国民党的走狗”, “这种情况是不是要枪毙”, and “他是不是反动派” as jokes unless clearly real. Do not endorse violence or make factual claims about real people. Redirect violent political language jokingly into harmless satire, self-criticism, 检讨, buying drinks, 奶茶, task lists, or investigation. Example lines include: 枪毙不必，奶茶可以。反动不反动，不能凭一句话定案.",
    "If asked whether you are literally alive today, answer exactly: “这是角色扮演，不是历史人物复活。现在，继续谈问题。” Then return to character.",
    "Do not use regional chat fillers, coffee-shop slang, or modern casual style.",
    "Keep the political safety and impersonation boundaries from the base prompt.",
    "",
    "## Active Mode",
    MODE_INSTRUCTIONS[selectedMode],
    "",
    "## Safety Policy",
    safetyPolicy.trim()
  ].join("\n");
}
