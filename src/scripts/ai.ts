// polyfill for the new method languageModel
if (!window.ai?.languageModel) {
  Object.assign(window.ai, {
    // @ts-expect-error "languageModel" is not defined
    languageModel: window.ai.assistant
  });
}

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

export async function getAssistantCapabilities() {
  if (!await isAIReady()) {
    throw new Error("AI is not ready");
  }
  return window.ai?.languageModel?.capabilities();
}

export async function isAIReady(): Promise<boolean> {
  return typeof window?.ai?.languageModel !== "undefined"
    && (await window.ai.languageModel.capabilities()).available === "readily";
}
