import React, { useRef } from "react";
import * as aiUtils from "../../../scripts/ai";
import { Textarea } from "@headlessui/react";
import { getAiMethodBasedOnUserInput } from "../../../scripts/ai";
import { sendMessageToCurrentTab } from "../../../utils/messaging";

function AskYar() {
  const responseRef = useRef<HTMLParagraphElement | null>(null);
  const [prompt, setPrompt] = React.useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessionRef = useRef<any>();
  const effectiveMethodRef = useRef("");
  const [messages, setMessages] = React.useState<{
    sender: "user" | "system";
    text: string;
  }[]>([]);
  const [selectedContext, setSelectedContext] = React.useState<string | undefined>();

  React.useEffect(() => {
    // Scroll to the bottom of the chat whenever messages update
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [messages]);

  React.useEffect(() => {
    sendMessageToCurrentTab({ action: "GET_SELECTED_TEXT" }).then((response) => {
      setSelectedContext(response.data?.trim());
    });
  }, []);

  const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    let finalPrompt = prompt.trim();
    if (!responseRef.current || !prompt.trim()) {
      return;
    }

    setMessages(prev => [...prev, { sender: "user", text: prompt.trim() }]);

    let session = sessionRef.current;
    let stream: AsyncIterable<string> | undefined;

    if (selectedContext && !session) {
      finalPrompt = `Using this context: ${selectedContext}, Instruction: ${prompt.trim()}`;
    }

    if (!session) {
      const selectedMethod = event?.currentTarget?.aiMethod.value || "autoDetect";
      if (selectedMethod === "autoDetect") {
        const relevantMethod = await getAiMethodBasedOnUserInput(prompt.trim());
        if (relevantMethod !== selectedMethod) {
          onDestroySession();
        }
        console.log(relevantMethod);
        effectiveMethodRef.current = relevantMethod;
      }
      else {
        if (effectiveMethodRef.current !== selectedMethod) {
          onDestroySession();
          effectiveMethodRef.current = selectedMethod;
        }
      }

      console.log("create session for", effectiveMethodRef.current);
      switch (effectiveMethodRef.current) {
        case "summarizer":
          session = await aiUtils.createSummarizerSession();
          stream = session?.summarizeStreaming(finalPrompt);
          break;
        case "writer":
          session = await aiUtils.createWriterSession();
          stream = session?.writeStreaming(finalPrompt);
          break;
        case "rewriter":
          session = await aiUtils.createRewriterSession();
          stream = session?.rewriteStreaming(finalPrompt);
          break;
        default:
          session = await aiUtils.createAssistantSession(undefined, {
            topK: 20,
            temperature: 0.8
          });
          stream = session?.promptStreaming(finalPrompt);
      }
      sessionRef.current = session;
    }

    if (!stream) {
      console.log("creating stream for", effectiveMethodRef.current);
      switch (effectiveMethodRef.current) {
        case "summarizer":
          stream = session?.summarizeStreaming(finalPrompt);
          break;
        case "writer":
          stream = session?.writeStreaming(finalPrompt);
          break;
        case "rewriter":
          stream = session?.rewriteStreaming(finalPrompt);
          break;
        default:
          stream = session?.promptStreaming(finalPrompt);
      }
    }

    if (!stream) {
      responseRef.current.innerText = "Error creating session";
      return;
    }

    setPrompt("");

    for await (const chunk of stream) {
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];

        if (lastMessage?.sender !== "system") {
          return [...prev, { sender: "system", text: chunk.trim() }];
        }

        const updatedMessages = [...prev];
        updatedMessages[prev.length - 1] = { sender: "system", text: chunk.trim() };
        return updatedMessages;
      });
    }

    console.log(
      `${sessionRef.current.tokensSoFar}/${sessionRef.current.maxTokens} (${sessionRef.current.tokensLeft} left)`
    );
  };

  const onDestroySession = () => {
    if (sessionRef.current) {
      setMessages([]);
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
    <div style={{ position: "relative", display: "flex", flexDirection: "column", height: "calc(100vh - 1rem)" }}>
      <form onSubmit={handleSubmit} style={{ position: "sticky", top: "0", marginBottom: "1rem" }}>
        <div>
          <input type="radio" id="auto" name="aiMethod" value="autoDetect" defaultChecked />
          <label htmlFor="auto">Auto Detect</label>
          <input type="radio" id="languageModel" name="aiMethod" value="languageModel" />
          <label htmlFor="languageModel">Language Model</label>
          <input type="radio" id="summarizer" name="aiMethod" value="summarizer" />
          <label htmlFor="summarizer">Summarizer</label>
          <input type="radio" id="writer" name="aiMethod" value="writer" />
          <label htmlFor="writer">Writer</label>
          <input type="radio" id="rewriter" name="aiMethod" value="rewriter" />
          <label htmlFor="rewriter">Rewriter</label>
        </div>
        <Textarea
          placeholder="Ask yar"
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
          maxLength={4048}
          required
          value={prompt}
          style={{ width: "100%" }}
        />
        <div>
          <button type="submit">Ask</button>
          <button onClick={onDestroySession} type="button">
            Start fresh
          </button>
        </div>
      </form>

      {!!selectedContext && (
        <div style={{
          padding: "10px",
          border: "1px solid black",
          marginBottom: "1rem",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden"
        }}
        >
          <strong>Context:</strong>
          {" "}
          {selectedContext}
        </div>
      )}

      <div
        ref={responseRef}
        style={{ flexGrow: 1, overflowY: "auto", border: "1px solid black", padding: "10px" }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ whiteSpace: "break-spaces" }}>
            <strong>
              {msg.sender === "user" ? "You" : "Yar"}
              :
            </strong>
            {" "}
            {msg.text}
          </div>
        ))}
      </div>
      <div>
        <strong>Method:</strong>
        {" "}
        {effectiveMethodRef.current || "Auto Detect"}
      </div>
    </div>
  );
}

export default AskYar;
