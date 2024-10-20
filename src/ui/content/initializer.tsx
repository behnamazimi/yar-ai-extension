type IframeName = "ask-yar";

type UIElements = {
  toggleAskYarButton: HTMLButtonElement | null;
  contentIframe: HTMLIFrameElement | null;
};

const uiElements: UIElements = {
  toggleAskYarButton: null,
  contentIframe: null
};

const initStyles = () => {
  const style = document.createElement("style");
  style.innerHTML = `
    .yar-iframe {
      position: fixed;
      top: 50%;
      left: 50%;
      width: 670px;
      z-index: 9999999999999;
      visibility: visible;
      opacity: 1;
      height: auto;
      min-height: 348px;
      border-radius: 8px;
      transform: translate(-50%, -50%) scale(0);
      border: 1px solid #e2e8f0;
      background-color: white;
      animation: iframeAnimation 0.25s forwards;
    }
    
    .yar-iframe.hidden {
      animation: iframeHide 0.25s forwards;
    }

    @keyframes iframeAnimation {
      from {
        transform: translate(-50%, -10%) scale(0);
        opacity: 0;
        visibility: hidden;
      }
      to {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
        visibility: visible;
      }
    }
    
    @keyframes iframeHide {
      from {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
        visibility: visible;
      }
      to {
        transform: translate(-50%, -10%) scale(0);
        opacity: 0;
        visibility: hidden;
      }
    }
  `;
  document.head.appendChild(style);
};

const createIframe = (name: IframeName) => {
  // check if iframe already exists
  const iframe = document.getElementById(`${name}-iframe`) as HTMLIFrameElement;
  if (iframe) {
    return iframe;
  }

  // create iframe
  const newIframe = document.createElement("iframe");
  newIframe.id = `${name}-iframe`;
  newIframe.setAttribute("name", name);
  newIframe.classList.add("yar-iframe");
  newIframe.src = chrome.runtime.getURL(`/content-iframe.html`);

  return newIframe;
};

const createToggleAskYarButton = () => {
  const id = "toggle-content-iframe";
  const button = document.getElementById(id) as HTMLButtonElement;
  if (button) {
    return button;
  }

  const newButton = document.createElement("button");
  newButton.id = id;
  newButton.textContent = "Ask Yar";
  newButton.onclick = () => {
    if (uiElements.contentIframe) {
      uiElements.contentIframe.classList.toggle("hidden");
      return;
    }
    const iframe = createIframe("ask-yar");
    uiElements.contentIframe = iframe;
    document.documentElement.appendChild(iframe);
  };

  document.body.appendChild(newButton);
  return newButton;
};

initStyles();
uiElements.toggleAskYarButton = createToggleAskYarButton();

// hide iframe when clicked outside
window.addEventListener("click", (event) => {
  const iframe = document.getElementById("ask-yar-iframe") as HTMLIFrameElement;
  if (iframe && !iframe.contains(event.target as Node)
    && uiElements.toggleAskYarButton !== event.target) {
    // check if click is not from the toggle button
    iframe.classList.add("hidden");
  }
});
