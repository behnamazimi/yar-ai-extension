import React, { useRef } from "react";
import * as aiUtils from "../../../scripts/ai";
import { Textarea } from "@headlessui/react";

function Dialog() {
  const responseRef = useRef<HTMLParagraphElement | null>(null);
  const [prompt, setPrompt] = React.useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessionRef = useRef<any>();
  const lastMethodRef = useRef("");

  const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const method = event?.currentTarget?.aiMethod.value;
    if (lastMethodRef.current !== method) {
      onDestroySession();
      lastMethodRef.current = method;
    }

    if (!responseRef.current) {
      return;
    }

    let session = sessionRef.current;
    let stream: AsyncIterable<string> | undefined;

    if (!session) {
      switch (method) {
        case "summarizer":
          session = await aiUtils.createSummarizerSession();
          stream = session?.summarizeStreaming(prompt.trim());
          break;
        case "writer":
          session = await aiUtils.createWriterSession();
          stream = session?.writeStreaming(prompt.trim());
          break;
        case "rewriter":
          session = await aiUtils.createRewriterSession();
          stream = session?.rewriteStreaming(prompt.trim());
          break;
        default:
          session = await aiUtils.createAssistantSession(undefined, {
            topK: 8,
            temperature: 0.6
          });
          stream = session?.promptStreaming(prompt.trim());
      }
      sessionRef.current = session;
    }

    switch (method) {
      case "summarizer":
        stream = session?.summarizeStreaming(prompt.trim());
        break;
      case "writer":
        stream = session?.writeStreaming(prompt.trim());
        break;
      case "rewriter":
        stream = session?.rewriteStreaming(prompt.trim());
        break;
      default:
        stream = session?.promptStreaming(prompt.trim());
    }

    if (!stream) {
      responseRef.current.innerText = "Error creating session";
      return;
    }

    responseRef.current.innerText = "Processing...";

    for await (const chunk of stream) {
      responseRef.current.innerText = chunk.trim();
    }

    console.log(
      `${sessionRef.current.tokensSoFar}/${sessionRef.current.maxTokens} (${sessionRef.current.tokensLeft} left)`
    );
  };

  const onDestroySession = () => {
    if (sessionRef.current) {
      console.log("destroying session");
      sessionRef.current.destroy();
      sessionRef.current = undefined;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="radio"
            id="languageModel"
            name="aiMethod"
            value="languageModel"
            defaultChecked
          />
          <label htmlFor="languageModel">Language Model</label>
          <input type="radio" id="summarizer" name="aiMethod" value="summarizer" />
          <label htmlFor="summarizer">Summarizer</label>
          <input type="radio" id="writer" name="aiMethod" value="writer" />
          <label htmlFor="writer">Writer</label>
          <input type="radio" id="rewriter" name="aiMethod" value="rewriter" />
          <label htmlFor="rewriter">Rewriter</label>
        </div>
        <Textarea
          placeholder={`Ask yar: What is the historical events for ${new Date().getDate()} ${new Date().toLocaleString(
            "default",
            { month: "short" }
          )}?`}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
          maxLength={2024}
          required
          value={prompt}
        />
        <button type="submit">Ask</button>
        <button onClick={onDestroySession} type="button">
          Destroy session
        </button>
      </form>
      <p ref={responseRef}></p>
    </div>
  );
}

export default Dialog;
