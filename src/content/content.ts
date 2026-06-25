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
        'button[data-testid^="tweetButton"]',
      );
      if (tweetButton && tweetButton.textContent === "Reply") {
        console.log("reply button arrived");
        // let's take the parent of this tweet button
        const tweetParent = tweetButton.parentElement;
        if (!tweetParent) return;

        // let's find if the tweet is in a dialog

        let tweetText = "";
        const tweetButtonDialog = tweetButton.closest('div[role="dialog"]');
        // if the tweet button is present in a dialog
        if (tweetButtonDialog) {
          const showMoreBtn = tweetButtonDialog.querySelector<HTMLElement>(
            'button[data-testid="tweet-text-show-more-link"]',
          );

          if (showMoreBtn) {
            showMoreBtn.click();
            return;
          }

          // if the showMore button is still present just return
          if (showMoreBtn) return;
          const tweetTextDiv = tweetButtonDialog.querySelector(
            'div[data-testid="tweetText"]',
          );
          if (tweetTextDiv) {
            tweetText = tweetTextDiv?.textContent || "";
          }
        }

        if (!tweetText) {
          const inlineReplyContainer = tweetButton.closest(
            'div[data-testid="inline_reply_offscreen"]',
          );
          if (inlineReplyContainer) {
            // if the reply has an inlineReplyContainer
            const inlineReplyContainerParent =
              inlineReplyContainer.parentElement;
            if (inlineReplyContainerParent) {
              const tweetTextDiv = inlineReplyContainerParent.querySelector(
                'div[data-testid="tweetText"]',
              );

              if (tweetTextDiv) {
                tweetText = tweetTextDiv?.textContent || "";
              }
            }
          }
        }

        if (!tweetText) {
          console.log("Tweet Text not found");
          return;
        }

        appendReplyAppToReplyParent(tweetParent, tweetText);
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
