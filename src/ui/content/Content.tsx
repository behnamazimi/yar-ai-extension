import React from "react";
import { useRef } from "react";
import * as aiUtils from "../../scripts/ai";
import "./Content.css";

function Content() {
  const responseRef = useRef<HTMLParagraphElement | null>(null);

  const handleClick = async () => {
    if (!responseRef.current) {
      return;
    }

    const session = await aiUtils.createAssistantSession();
    const stream = await session?.promptStreaming("Hello, Yar! My name is Behnam! What is the probability of winning a lottery?");

    if (!stream) {
      responseRef.current.innerText = "Error creating session";
      return;
    }
    responseRef.current.innerText = "Processing...";
    for await (const chunk of stream) {
      responseRef.current.innerText = chunk.trim();
    }
  };

  return (
    <div className="App">
      <div>
        <img src={chrome.runtime.getURL("./vite.svg")} className="logo" alt="Vite logo" />
      </div>
      <h1>YarAI Content</h1>
      <p>Under construction...</p>
      <p id="response" ref={responseRef}></p>
      <button onClick={handleClick}>
        Ask the Question
      </button>
    </div>
  );
}

export default Content;
