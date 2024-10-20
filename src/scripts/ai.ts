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

export async function getAiMethodBasedOnUserInput(userInput: string) {
  const generativePrompt = `Analyze the "User Input" and determine the most relevant function - assistant, writer, summarizer, or rewriter - that can provide the best response.
Follow these rules:
- Respond with the function name only, 1 word maximum.
- It's Assistant if: User asks a question, requests information, or seeks assistance on different topics like writing a code.
  - Example: "What is the capital of France?", "Can you help me find a recipe for pasta?", "I need assistance with my homework.", "Write a coding function in Python."
- It's Writer if: User requests content creation, such as articles, stories, or poems
  - Example: "Write a short story about a dragon", "Create a poem about love", "Write an article about the benefits of exercise."
- It's Summarizer if: User provides a block of text and requests a summary or key points.
  - Example: "Summarize this article for me.", "Can   you give me the main points from this paragraph?", "What are the key takeaways from this report?"
- It's Rewriter if: User asks to rephrase, edit or grammar check.
  - Example: "Can you rewrite this sentence?", "Edit this paragraph for me.", "Improve the grammar in this text.", "Improve the clarity of this paragraph"

User Input: ${userInput}
`;

  const session = await createAssistantSession(generativePrompt, {
    topK: 3,
    temperature: 0.2
  });
  const response = await session?.prompt(generativePrompt);
  session?.destroy();
  return response.toLowerCase().trim().split(" ")[0];
}
