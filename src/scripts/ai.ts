type AIMethodToSession = {
  assistant: AITextSession;
  summarizer: AISummarizerSession;
  writer: AIWriterSession;
  rewriter: AIRewriterSession;
};

type AIMethod = keyof AIMethodToSession;

async function createSession<T extends AIMethod>(
  method: T
): Promise<AIMethodToSession[T] | undefined> {
  if (!(await isAssistantReady())) {
    throw new Error("AI methods are not ready");
  }
  return window.ai?.[method]?.create() as (AIMethodToSession[T] | undefined);
}

export function createAssistantSession(): Promise<AITextSession | undefined> {
  return createSession("assistant");
}

export function createSummarizerSession(): Promise<AISummarizerSession | undefined> {
  return createSession("summarizer");
}

export function createWriterSession(): Promise<AIWriterSession | undefined> {
  return createSession("writer");
}

export function createRewriterSession(): Promise<AIRewriterSession | undefined> {
  return createSession("rewriter");
}

export async function isAssistantReady(): Promise<boolean> {
  if (!isAIReady()) {
    return false;
  }
  const capabilities = await getAssistantCapabilities();
  return capabilities?.available === "readily";
}

export async function getAssistantCapabilities(): Promise<AIAssistantCapabilities> {
  if (!isAIReady()) {
    throw new Error("AI is not ready");
  }
  return window.ai?.assistant?.capabilities();
}

export function isAIReady(): boolean {
  return typeof window.ai !== "undefined";
}
