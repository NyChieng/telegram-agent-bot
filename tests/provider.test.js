import assert from "node:assert/strict";
import test from "node:test";

import { createLlmProvider } from "../src/llm/provider.js";
import {
  buildGeminiContents,
  buildGeminiModelCandidates,
  isRetryableGeminiModelError
} from "../src/llm/gemini.js";

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

test("Gemini model candidates retry default model after routed model failures", () => {
  assert.deepEqual(
    buildGeminiModelCandidates({
      selectedModel: "gemini-3.1-pro-preview",
      defaultModel: "gemini-3.5-flash"
    }),
    ["gemini-3.1-pro-preview", "gemini-3.5-flash"]
  );
});

test("Gemini model candidates avoid duplicate retries", () => {
  assert.deepEqual(
    buildGeminiModelCandidates({
      selectedModel: "gemini-3.5-flash",
      defaultModel: "gemini-3.5-flash"
    }),
    ["gemini-3.5-flash"]
  );
});

test("Gemini provider treats unavailable and quota model errors as retryable", () => {
  assert.equal(isRetryableGeminiModelError(new Error("code\":404")), true);
  assert.equal(isRetryableGeminiModelError(new Error("code\":429")), true);
  assert.equal(isRetryableGeminiModelError(new Error("network timeout")), false);
});

test("Gemini contents support text-only prompts", () => {
  assert.deepEqual(buildGeminiContents({ prompt: "hello" }), "hello");
});

test("Gemini contents support inline image data with text prompts", () => {
  assert.deepEqual(
    buildGeminiContents({
      prompt: "Describe this",
      images: [{ mimeType: "image/jpeg", data: "abc123" }]
    }),
    [
      { inlineData: { mimeType: "image/jpeg", data: "abc123" } },
      { text: "Describe this" }
    ]
  );
});
