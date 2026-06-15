import { chromeActions } from "./constants";

export type GenerateReplyMessage = {
  action: typeof chromeActions.GENERATE_REPLY;
  data: {
    tweetText: string;
  };
};

export type GetTweetSentimentMessage = {
  action: typeof chromeActions.GET_TWEET_SENTIMENT;
  data: {
    language: string;
  };
};

// Add new message shapes here and union them in:
export type ChromeMessage = GenerateReplyMessage | GetTweetSentimentMessage;
