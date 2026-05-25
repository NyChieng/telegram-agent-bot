const REASONING_PATTERNS = [
  /```[\s\S]*```/,
  /\b(?:stack trace|traceback|exception|typeerror|referenceerror|syntaxerror)\b/i,
  /\b(?:debug|assignment|architecture|explain|summarize|reasoning|design|refactor|algorithm)\b/i
];

const CASUAL_PATTERNS = [
  /\b(?:hi|hello|hey|yo|sup|joke|lol|haha|thanks|thank you|ok|okay)\b/i
];

export function routeGeminiModel({
  message = "",
  mode = "normal",
  defaultModel = "gemini-3.5-flash",
  fastModel = "gemini-3.1-flash-lite",
  reasoningModel = "gemini-3.1-pro-preview"
} = {}) {
  const text = String(message).trim();

  if (!text) {
    return fastModel;
  }

  if (REASONING_PATTERNS.some((pattern) => pattern.test(text))) {
    return reasoningModel;
  }

  if (isVeryLightweight(text) && ["normal", "spicy"].includes(mode)) {
    return fastModel;
  }

  if (isShortCasual(text)) {
    return defaultModel;
  }

  return defaultModel;
}

function isVeryLightweight(text) {
  return text.length <= 12 && !/[?.!].*[?.!]/.test(text);
}

function isShortCasual(text) {
  return text.length <= 80 && CASUAL_PATTERNS.some((pattern) => pattern.test(text));
}
