import { appendReplyAppToReplyParent } from "./contentHelper";

// Options for the observer (which mutations to observe)
const config = { childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = (
  mutationList: MutationRecord[],
  observer: MutationObserver,
) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
      const tweetButton = document.querySelector(
        'button[data-testid="tweetButtonInline"]',
      );
      if (tweetButton && tweetButton.textContent === "Reply") {
        console.log("reply button arrived");
        // let's take the parent of this tweet button
        const tweetParent = tweetButton.parentElement;
        if (!tweetParent) return;

        // we have to inject our button in this tweet parent
        appendReplyAppToReplyParent(tweetParent);
      }
    }
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(document.body, config);

// Later, you can stop observing
// observer.disconnect();
