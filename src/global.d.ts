type AIMethod = "assistant" | "summarizer" | "writer" | "rewriter";

interface AsyncIterableReadableStream<T> extends ReadableStream<T> {
  [Symbol.asyncIterator](): AsyncIterableIterator<T>;
}

type AIAssistantCapabilities = {
  available: string;
  defaultTemperature: number;
  defaultTopK: number;
  maxTopK: number;
}

type AITextSession = {
  maxTokens: number;
  tokensSoFar: number;
  tokensLeft: number;
  topK: number;
  temperature: number;
  prompt: (text: string) => Promise<string>;
  promptStreaming: (text: string) => Promise<AsyncIterableReadableStream<string>>;
  destroy: () => void;
  clone: () => AITextSession;
}

type AISummarizerSession = {
  summarize: (text: string) => Promise<string>;
  summarizeStreaming: (text: string) => Promise<AsyncIterableReadableStream<string>>;
  destroy: () => void;
}

type AIWriterSession = {
  sharedContext: string;
  write: (text: string) => Promise<string>;
  writeStreaming: (text: string) => Promise<AsyncIterableReadableStream<string>>;
}

type AIRewriterSession = {
  sharedContext: string;
  tone: string;
  length: string;
  rewrite: (text: string) => Promise<string>;
  rewriteStreaming: (text: string) => Promise<AsyncIterableReadableStream<string>>;
  destroy: () => void;
}


interface Window {
  ai?: {
    assistant: {
      capabilities: () => Promise<any>;
      create: () => Promise<AITextSession>;
    };
    summarizer: {
      capabilities: () => Promise<any>;
      create: () => Promise<AISummarizerSession>;
    };
    writer: {
      capabilities: () => Promise<any>;
      create: () => Promise<AIWriterSession>;
    };
    rewriter: {
      capabilities: () => Promise<any>;
      create: () => Promise<AIRewriterSession>;
    };
  };
}
