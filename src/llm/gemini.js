import { routeGeminiModel } from "./modelRouter.js";

const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash";

export function createGeminiProvider({
  geminiApiKey,
  geminiModel = DEFAULT_GEMINI_MODEL,
  geminiFastModel = "gemini-3.1-flash-lite",
  geminiReasoningModel = "gemini-3.1-pro-preview"
}) {
  if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY is required for the Gemini provider.");
  }

  return {
    name: "gemini",
    model: geminiModel,

    async generate({ systemPrompt, prompt, images = [], metadata = {} }) {
      if (!prompt?.trim()) {
        throw new Error("A prompt is required for Gemini generation.");
      }

      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: geminiApiKey });
      const selectedModel = routeGeminiModel({
        message: prompt,
        mode: metadata.mode,
        hasImages: images.length > 0,
        defaultModel: geminiModel,
        fastModel: geminiFastModel,
        reasoningModel: geminiReasoningModel
      });
      const modelCandidates = buildGeminiModelCandidates({
        selectedModel,
        defaultModel: geminiModel
      });

      const response = await generateWithModelFallbacks({
        ai,
        modelCandidates,
        systemPrompt,
        prompt,
        images
      });

      const text = response.text?.trim();

      if (!text) {
        return "同志，刚才电台杂音太重，我没有收到完整情报。你再说一遍，我重新调查研究。";
      }

      return text;
    }
  };
}

export function buildGeminiModelCandidates({ selectedModel, defaultModel }) {
  return [...new Set([selectedModel, defaultModel].filter(Boolean))];
}

export function buildGeminiContents({ prompt, images = [] }) {
  if (images.length === 0) {
    return prompt;
  }

  return [
    ...images.map((image) => ({
      inlineData: {
        mimeType: image.mimeType,
        data: image.data
      }
    })),
    { text: prompt }
  ];
}

export function isRetryableGeminiModelError(error) {
  const message = String(error?.message ?? error);
  return /code["']?:\s*(?:404|429)|\b(?:404|429)\b/.test(message);
}

async function generateWithModelFallbacks({ ai, modelCandidates, systemPrompt, prompt, images }) {
  let lastError;

  for (const model of modelCandidates) {
    try {
      return await ai.models.generateContent({
        model,
        contents: buildGeminiContents({ prompt, images }),
        config: {
          systemInstruction: systemPrompt,
          safetySettings: [
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
          ]
        }
      });
    } catch (error) {
      lastError = error;

      if (!isRetryableGeminiModelError(error)) {
        throw error;
      }
    }
  }

  throw lastError;
}
