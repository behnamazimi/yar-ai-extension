import { MessagePayload, MessageResponseCallback } from "../types";

export async function sendMessageToCurrentTab(payload: MessagePayload): Promise<MessagePayload> {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      if (tabs && tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, payload, (response) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          }
          else {
            resolve(response);
          }
        });
      }
      else {
        reject(new Error("No active tab found"));
      }
    });
  });
}

export function sendGlobalMessage(payload: MessagePayload, responseCallback: MessageResponseCallback) {
  chrome.runtime.sendMessage(payload, responseCallback);
}
