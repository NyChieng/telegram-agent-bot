import assert from "node:assert/strict";
import test from "node:test";

import { createLlmProvider } from "../src/llm/provider.js";

test("creates Gemini as the default provider", () => {
  const provider = createLlmProvider({
    geminiApiKey: "test-key",
    geminiModel: "gemini-2.5-flash"
  });

  assert.equal(provider.name, "gemini");
  assert.equal(typeof provider.generate, "function");
});

test("throws a clear error for unsupported providers", () => {
  assert.throws(
    () => createLlmProvider({ providerName: "anthropic" }),
    /Unsupported LLM provider/
  );
});

test("OpenAI provider is an explicit not-yet-implemented placeholder", () => {
  assert.throws(
    () => createLlmProvider({ providerName: "openai" }),
    /not implemented/i
  );
});
