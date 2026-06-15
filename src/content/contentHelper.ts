import React from "react";
import { createRoot } from "react-dom/client";
import browser from "webextension-polyfill";
import TweetReplier from "./apps/TweetReplier";

const getContentStyleLink = () => {
  const link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("href", browser.runtime.getURL("src/content/content.css"));
  return link;
};

const getTweetAIReplierAppMountElement = () => {
  const mountPoint = document.createElement("div");
  mountPoint.id = "tweet_ai_replier_app_mount";
  return mountPoint;
};

const appendReplyAppToReplyParent = (
  replyBtnParent: HTMLElement,
  tweetText: string,
) => {
  if (replyBtnParent.querySelector("#tweet-replier-root")) {
    console.log("cant append button already there");
    return;
  }

  replyBtnParent.style.flexDirection = "row";
  replyBtnParent.style.gap = "5px";
  replyBtnParent.style.opacity = "1";

  const rootDiv = document.createElement("div");
  rootDiv.id = "tweet-replier-root";
  replyBtnParent.prepend(rootDiv);

  if (!replyBtnParent.querySelector("#tweet-replier-root")) {
    return;
  }

  // we need a mount point and a shadow root

  // attach a shadow root with the root container
  const shadowRoot = rootDiv.attachShadow({
    mode: "open",
  });

  const styleLink = getContentStyleLink();
  console.log("style", styleLink);
  shadowRoot.prepend(styleLink);

  const mountPoint = getTweetAIReplierAppMountElement();
  shadowRoot.append(mountPoint);

  const tweetReplierReactRoot = createRoot(mountPoint);
  tweetReplierReactRoot.render(
    React.createElement(TweetReplier, {
      tweetText,
    }),
  );
};

export { appendReplyAppToReplyParent };
