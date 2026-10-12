import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIProvider, GenerateParams } from "../types";

export class GeminiProvider implements AIProvider {
  id = "gemini";
  name = "Gemini";
  private client: GoogleGenerativeAI;
  private model: string;

  constructor(options?: { model?: string }) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    this.client = new GoogleGenerativeAI(apiKey);
    this.model = options?.model || "gemini-2.0-flash";
  }

  async generateText(params: GenerateParams): Promise<string> {
    const model = this.client.getGenerativeModel({
      model: this.model,
      systemInstruction: params.systemPrompt,
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: params.prompt }] }],
      generationConfig: {
        temperature: params.temperature ?? 0.7,
        maxOutputTokens: params.maxTokens,
      },
    });

    return result.response.text();
  }

  async streamText(params: GenerateParams): Promise<ReadableStream<string>> {
    const model = this.client.getGenerativeModel({
      model: this.model,
      systemInstruction: params.systemPrompt,
    });

    const result = await model.generateContentStream({
      contents: [{ role: "user", parts: [{ text: params.prompt }] }],
      generationConfig: {
        temperature: params.temperature ?? 0.7,
        maxOutputTokens: params.maxTokens,
      },
    });

    return new ReadableStream<string>({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(text);
          }
        }
        controller.close();
      },
    });
  }

  async generateJSON<T>(
    params: GenerateParams & { parse: (text: string) => T }
  ): Promise<T> {
    const model = this.client.getGenerativeModel({
      model: this.model,
      systemInstruction: [
        params.systemPrompt,
        "Respond ONLY with valid JSON. No markdown, no code fences, no explanation.",
      ]
        .filter(Boolean)
        .join("\n\n"),
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: params.prompt }] }],
      generationConfig: {
        temperature: params.temperature ?? 0.3,
        maxOutputTokens: params.maxTokens,
        responseMimeType: "application/json",
      },
    });

    const text = result.response.text();
    const cleaned = text.replace(/^```(?:json)?\n?|```$/g, "").trim();
    return params.parse(cleaned);
  }
}
