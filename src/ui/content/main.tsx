import React from "react";
import ReactDOM from "react-dom/client";
import Content from "./Content";

console.log("Hello from content script");

if (window.ai !== undefined) {
  console.log("AI is loaded");
  const callIt = async () => {
    const session = await window.ai?.assistant.create();
    if (session === undefined) {
      return "Session is undefined";
    }
    return await session.prompt("Hello, Yar! May I ask you a question?");
  };

  callIt()
    .then((response) => {
      console.log(response);
    });
}

const root = document.createElement("div");
root.id = "yar-ai-content";
document.body.appendChild(root);

ReactDOM.createRoot(root as HTMLElement).render(
  <React.StrictMode>
    <Content />
  </React.StrictMode>
);
