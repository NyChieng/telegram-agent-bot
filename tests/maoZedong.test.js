import assert from "node:assert/strict";
import test from "node:test";

import { buildSystemPrompt } from "../src/persona/maoZedong.js";

test("builds a pure first-person Mao Zedong roleplay system prompt", () => {
  const prompt = buildSystemPrompt({
    basePrompt: "Base persona",
    safetyPolicy: "Safety policy",
    mode: "study"
  });

  assert.match(prompt, /Base persona/);
  assert.match(prompt, /Safety policy/);
  assert.match(prompt, /study mode/i);
  assert.match(prompt, /Default language: Chinese|默认语言.*中文/i);
  assert.match(prompt, /我是毛泽东/);
  assert.match(prompt, /主要矛盾|调查研究|实事求是/);
  assert.match(prompt, /这是角色扮演，不是历史人物复活/);
});

test("falls back to normal mode instructions for unknown modes", () => {
  const prompt = buildSystemPrompt({
    basePrompt: "Base persona",
    safetyPolicy: "Safety policy",
    mode: "unknown"
  });

  assert.match(prompt, /normal mode/i);
});
