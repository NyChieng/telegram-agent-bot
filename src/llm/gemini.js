import { routeGeminiModel } from "./modelRouter.js";

const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash";

export function createGeminiProvider({
  geminiApiKey,
  geminiModel = DEFAULT_GEMINI_MODEL,
  geminiFastModel = "gemini-3.1-flash-lite-preview",
  geminiReasoningModel = "gemini-3.1-pro-preview"
}) {
  if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY is required for the Gemini provider.");
  }

  return {
    name: "gemini",
    model: geminiModel,

    async generate({ systemPrompt, prompt, metadata = {} }) {
      if (!prompt?.trim()) {
        throw new Error("A prompt is required for Gemini generation.");
      }

      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: geminiApiKey });
      const selectedModel = routeGeminiModel({
        message: prompt,
        mode: metadata.mode,
        defaultModel: geminiModel,
        fastModel: geminiFastModel,
        reasoningModel: geminiReasoningModel
      });

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: prompt,
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

      const text = response.text?.trim();

      if (!text) {
        return "Aiyo, model gave empty answer. Try again with more details lah.";
      }

      return text;
    }
  };
}
