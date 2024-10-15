export function createAssistantSession(systemPrompt?: string, options?: AILanguageModelCreateOptions) {
  return window.ai?.languageModel?.create({
    ...options,
    systemPrompt
  });
}

export function createSummarizerSession(options?: AISummarizerCreateOptions) {
  return window.ai?.summarizer?.create(options);
}

export function createWriterSession(options?: AIWriterCreateOptions) {
  return window.ai?.writer?.create(options);
}

export function createRewriterSession(options?: AIRewriterCreateOptions) {
  return window.ai?.rewriter?.create(options);
}

export async function isAssistantReady(): Promise<boolean> {
  if (!isAIReady()) {
    return false;
  }
  const capabilities = await getAssistantCapabilities();
  return capabilities?.available === "readily";
}

export async function getAssistantCapabilities() {
  if (!isAIReady()) {
    throw new Error("AI is not ready");
  }
  return window.ai?.languageModel?.capabilities();
}

export function isAIReady(): boolean {
  return typeof window.ai !== "undefined";
}
