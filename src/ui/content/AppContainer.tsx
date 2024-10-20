import React from "react";
import AskYar from "./AskYar";

function AppContainer() {
  const targetScreen = window.name;
  if (targetScreen === "ask-yar") {
    return <AskYar />;
  }

  return <h1>No screen found</h1>;
}

export default AppContainer;
