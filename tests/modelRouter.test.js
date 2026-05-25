import assert from "node:assert/strict";
import test from "node:test";

import { routeGeminiModel } from "../src/llm/modelRouter.js";

const models = {
  defaultModel: "gemini-3.5-flash",
  fastModel: "gemini-3.1-flash-lite-preview",
  reasoningModel: "gemini-3.1-pro-preview"
};

test("routes code blocks and debugging language to the reasoning model", () => {
  assert.equal(routeGeminiModel({ message: "```js\nthrow new Error()\n```", mode: "normal", ...models }), models.reasoningModel);
  assert.equal(routeGeminiModel({ message: "Can you debug this stack trace?", mode: "spicy", ...models }), models.reasoningModel);
});

test("routes assignment, architecture, explain, and summarize requests to reasoning", () => {
  for (const message of [
    "help with my assignment",
    "review this architecture",
    "explain recursion",
    "summarize the group chat"
  ]) {
    assert.equal(routeGeminiModel({ message, mode: "normal", ...models }), models.reasoningModel);
  }
});

test("routes short casual chat to default model", () => {
  assert.equal(routeGeminiModel({ message: "hello bot", mode: "study", ...models }), models.defaultModel);
  assert.equal(routeGeminiModel({ message: "tell me a joke", mode: "silent", ...models }), models.defaultModel);
});

test("allows fast model for very lightweight normal and spicy mode replies", () => {
  assert.equal(routeGeminiModel({ message: "ok?", mode: "normal", ...models }), models.fastModel);
  assert.equal(routeGeminiModel({ message: "lol", mode: "spicy", ...models }), models.fastModel);
});
