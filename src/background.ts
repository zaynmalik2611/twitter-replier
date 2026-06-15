import browser from "webextension-polyfill";
import { chromeActions } from "./constants";
import { ChromeMessage } from "./types";

const validateSettings = (settings: {
  prompt: string;
  model: string;
  apiUrl: string;
}) => {
  const { prompt, model, apiUrl } = settings;
  if (!prompt) throw new Error("prompt is required");
  if (!model) throw new Error("model is required");
  if (!apiUrl) throw new Error("apiUrl is required");

  return { prompt, model, apiUrl };
};

const onMessageReceivedByBackground = (
  message: ChromeMessage,
  sender: browser.Runtime.MessageSender,
  sendResponse: (response?: unknown) => void,
): any => {
  switch (message.action) {
    case chromeActions.GENERATE_REPLY: {
      const { tweetText } = message.data;

      console.log("hahaha this is in the bg", tweetText);
      // we will send this tweetText to the ai api and get a response
      (async () => {
        try {
          const { tweet_replier_settings } = await browser.storage.local.get(
            "tweet_replier_settings",
          );
          const validatedSettings = validateSettings(tweet_replier_settings);
          const { prompt, model, apiUrl } = validatedSettings;

          const resolvedPrompt = prompt.replace("${tweetText}", tweetText);

          const resp = await fetch(apiUrl, {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              model: model,
              prompt: resolvedPrompt,
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

    case chromeActions.GET_TWEET_SENTIMENT: {
      const { language } = message.data;
      console.log("language", language);
      sendResponse({ success: true, sentiment: "positive" });
      break;
    }

    default:
      break;
  }
};

browser.runtime.onMessage.addListener(onMessageReceivedByBackground);
