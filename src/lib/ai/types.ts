export interface GenerateParams {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface StructuredParams<T> extends GenerateParams {
  schema: {
    name: string;
    description?: string;
    parse: (text: string) => T;
  };
}

export interface AIProvider {
  id: string;
  name: string;
  generateText(params: GenerateParams): Promise<string>;
  streamText(params: GenerateParams): Promise<ReadableStream<string>>;
  generateJSON<T>(params: GenerateParams & { parse: (text: string) => T }): Promise<T>;
}
