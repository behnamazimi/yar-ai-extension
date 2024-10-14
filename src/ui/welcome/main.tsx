import React from "react";
import ReactDOM from "react-dom/client";
import Welcome from "./Welcome";

ReactDOM.createRoot(
  document.getElementById("yar-ai-welcome") as HTMLElement).render(
  <React.StrictMode>
    <Welcome />
  </React.StrictMode>
);
