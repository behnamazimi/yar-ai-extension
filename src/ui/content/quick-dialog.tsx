import React from "react";
import ReactDOM from "react-dom/client";
import Dialog from "./Dialog";

const root = document.createElement("div");
root.id = "yar-ai-dialog";
document.body.appendChild(root);

ReactDOM.createRoot(root as HTMLElement).render(
  <React.StrictMode>
    <Dialog />
  </React.StrictMode>
);
