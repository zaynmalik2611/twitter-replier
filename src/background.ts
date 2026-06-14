import browser from "webextension-polyfill";
import { chromeActions } from "./constants";

interface MessagePayload {
  action: string;
  data?: unknown;
}

const onMessageReceivedByBackground = (
  message: MessagePayload,
  sender: browser.Runtime.MessageSender,
  sendResponse: (response?: unknown) => void,
): any => {
  const { action, data } = message;
  switch (action) {
    case chromeActions.GENERATE_REPLY: {
      const { tweetText } = data;

      console.log("hahaha this is in the bg", tweetText);
      // we will send this tweetText to the ai api and get a response
      (async () => {
        try {
          const resp = await fetch("http://localhost:11434/api/generate", {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              model: "deepseek-r1:8b",
              prompt: "Hello",
              stream: false,
            }),
          });
          const { response } = await resp.json();

          sendResponse({
            success: true,
            reply: response,
          });
        } catch (error) {
          console.log("an error occured", error);
          sendResponse({
            success: false,
            error: "Failed to generate reply for this tweet",
          });
        }
      })();
      return true;
    }

    default:
      break;
  }
};

browser.runtime.onMessage.addListener(onMessageReceivedByBackground);
