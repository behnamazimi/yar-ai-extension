import React from "react";
import ReactDOM from "react-dom/client";
import DialogContainer from "./DialogContainer";

const root = document.createElement("div");
root.id = "yar-ai-content";
document.body.appendChild(root);

ReactDOM.createRoot(root as HTMLElement).render(
  <React.StrictMode>
    <DialogContainer />
  </React.StrictMode>
);
