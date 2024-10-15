import React from "react";
import styled from "@emotion/styled";
import { Button } from "@headlessui/react";

export const StyledIframe = styled.iframe`
    position: fixed;
    top: 50%;
    left: 50%;
    width: 670px;
    max-height: calc(100vh - 30px);
    z-index: 9999999999999;
    visibility: visible;
    opacity: 1;
    min-height: 48px;
    border-radius: 8px;
    transform: translate(-50%, -50%) scale(1);
    transition: transform 0.4s ease, opacity 0.35s ease, visibility 0.35s ease;
    border: 1px solid #e2e8f0;
    background-color: white;
`;

const DialogContainer = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);

  // Close dialog when clicking outside it
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (iframeRef.current && !iframeRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [iframeRef]);

  return (
    <>
      <StyledIframe
        src={chrome.runtime.getURL("./quick-dialog.html")}
        ref={iframeRef}
        style={{
          visibility: isOpen ? "visible" : "hidden",
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -30%) scale(0)"
        }}
      />
      <Button onClick={() => setIsOpen(!isOpen)}>
        Toggle Dialog
      </Button>
    </>
  );
};

export default DialogContainer;
