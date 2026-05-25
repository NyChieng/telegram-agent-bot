import dotenv from "dotenv";

dotenv.config();

const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash";
const DEFAULT_GEMINI_FAST_MODEL = "gemini-3.1-flash-lite-preview";
const DEFAULT_GEMINI_REASONING_MODEL = "gemini-3.1-pro-preview";
const DEFAULT_MODE = "normal";

export function loadConfig(env = process.env) {
  return {
    nodeEnv: env.NODE_ENV ?? "development",
    telegramBotToken: env.TELEGRAM_BOT_TOKEN ?? "",
    geminiApiKey: env.GEMINI_API_KEY ?? "",
    geminiModel: env.GEMINI_MODEL ?? DEFAULT_GEMINI_MODEL,
    geminiFastModel: env.GEMINI_FAST_MODEL ?? DEFAULT_GEMINI_FAST_MODEL,
    geminiReasoningModel: env.GEMINI_REASONING_MODEL ?? DEFAULT_GEMINI_REASONING_MODEL,
    openAiApiKey: env.OPENAI_API_KEY ?? "",
    openAiModel: env.OPENAI_MODEL ?? "gpt-5.5",
    defaultMode: env.DEFAULT_MODE ?? DEFAULT_MODE,
    providerName: env.LLM_PROVIDER ?? "gemini"
  };
}

export function validateConfig(config) {
  const missing = [];

  if (!config.telegramBotToken) {
    missing.push("TELEGRAM_BOT_TOKEN");
  }

  if (config.providerName === "gemini" && !config.geminiApiKey) {
    missing.push("GEMINI_API_KEY");
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}
