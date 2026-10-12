import type { AIProvider } from "./types";
import { LiteLLMProvider } from "./providers/litellm";
import { GeminiProvider } from "./providers/gemini";

export type { AIProvider, GenerateParams, StructuredParams } from "./types";

const providers = new Map<string, AIProvider>();

function createProvider(id: string): AIProvider {
  switch (id) {
    case "litellm":
      return new LiteLLMProvider();
    case "gemini":
      return new GeminiProvider();
    default:
      throw new Error(`Unknown AI provider: ${id}`);
  }
}

export function getProvider(id: string): AIProvider {
  let provider = providers.get(id);
  if (!provider) {
    provider = createProvider(id);
    providers.set(id, provider);
  }
  return provider;
}

export function getDefaultProvider(): AIProvider {
  if (process.env.LITELLM_BASE_URL) return getProvider("litellm");
  if (process.env.GEMINI_API_KEY) return getProvider("gemini");
  throw new Error(
    "No AI provider configured. Set LITELLM_BASE_URL or GEMINI_API_KEY."
  );
}

export function getAvailableProviders(): string[] {
  const available: string[] = [];
  if (process.env.LITELLM_BASE_URL) available.push("litellm");
  if (process.env.GEMINI_API_KEY) available.push("gemini");
  return available;
}
