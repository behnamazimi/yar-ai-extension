import React from "react";
import ReactDOM from "react-dom/client";
import Popup from "./Popup";

ReactDOM.createRoot(
  document.getElementById("yar-ai-popup") as HTMLElement
).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
