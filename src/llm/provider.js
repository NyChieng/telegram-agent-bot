import { createGeminiProvider } from "./gemini.js";
import { createOpenAiProvider } from "./openai.js";

export function createLlmProvider(config = {}) {
  const providerName = (config.providerName ?? config.llmProvider ?? "gemini").toLowerCase();

  if (providerName === "gemini") {
    return createGeminiProvider(config);
  }

  if (providerName === "openai") {
    return createOpenAiProvider(config);
  }

  throw new Error(`Unsupported LLM provider: ${providerName}`);
}
