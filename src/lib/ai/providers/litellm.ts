import OpenAI from "openai";
import type { AIProvider, GenerateParams } from "../types";

export class LiteLLMProvider implements AIProvider {
  id = "litellm";
  name = "LiteLLM";
  private client: OpenAI;
  private model: string;

  constructor(options?: { model?: string }) {
    const baseURL = process.env.LITELLM_BASE_URL;
    if (!baseURL) {
      throw new Error("LITELLM_BASE_URL is not configured");
    }

    const apiKey =
      process.env.LITELLM_CLAUDE_API_KEY ||
      process.env.LITELLM_GROK_API_KEY ||
      "not-needed";

    this.client = new OpenAI({ baseURL, apiKey });
    this.model =
      options?.model ||
      process.env.LITELLM_CLAUDE_MODEL_ID ||
      process.env.LITELLM_GROK_MODEL_ID ||
      "gpt-3.5-turbo";
  }

  async generateText(params: GenerateParams): Promise<string> {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
    if (params.systemPrompt) {
      messages.push({ role: "system", content: params.systemPrompt });
    }
    messages.push({ role: "user", content: params.prompt });

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages,
      temperature: params.temperature ?? 1,
      max_tokens: params.maxTokens,
    });

    return response.choices[0]?.message?.content ?? "";
  }

  async streamText(params: GenerateParams): Promise<ReadableStream<string>> {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
    if (params.systemPrompt) {
      messages.push({ role: "system", content: params.systemPrompt });
    }
    messages.push({ role: "user", content: params.prompt });

    const stream = await this.client.chat.completions.create({
      model: this.model,
      messages,
      temperature: params.temperature ?? 1,
      max_tokens: params.maxTokens,
      stream: true,
    });

    return new ReadableStream<string>({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content;
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
    const response = await this.generateText({
      ...params,
      systemPrompt: [
        params.systemPrompt,
        "Respond ONLY with valid JSON. No markdown, no code fences, no explanation.",
      ]
        .filter(Boolean)
        .join("\n\n"),
    });

    const cleaned = response.replace(/^```(?:json)?\n?|```$/g, "").trim();
    return params.parse(cleaned);
  }
}
