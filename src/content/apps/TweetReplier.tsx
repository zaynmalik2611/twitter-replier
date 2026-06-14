import browser from "webextension-polyfill";
import { chromeActions } from "../../constants";
import { useState, useEffect } from "react";
import { MdCancel } from "react-icons/md";

interface TweetReplierProps {
  tweetText: string;
}
function TweetReplier({ tweetText }: TweetReplierProps) {
  console.log("tweetText", tweetText);
  const [showReply, setShowReply] = useState(false);
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dots, setDots] = useState(1);

  const generateReply = async () => {
    console.log("i was pressed!!");
    try {
      setIsGenerating(true);
      const {
        success,
        reply: replyFromBG,
        error: errFromBG,
      } = await browser.runtime.sendMessage({
        action: chromeActions.GENERATE_REPLY,
        data: {
          tweetText,
        },
      });
      if (success) {
        setReply(replyFromBG);
      } else {
        setError(errFromBG);
      }
      setShowReply(true);
      console.log("the generated reply", reply);
    } catch (error) {
      setError("Some error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyReply = (replyText: string) => {
    navigator.clipboard.writeText(replyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        className="px-2.5 py-1.5 rounded-full font-bold cursor-pointer bg-[#eff3f4] text-[#0f1419] select-none"
        onClick={generateReply}
      >
        {isGenerating ? `Generating...` : "Reply With AI"}
      </button>
      {showReply && (
        <div className="absolute bottom-10.75 right-0  bg-white rounded-[10px] w-52.5 h-50 text-black">
          <div className="flex">
            <div
              className="relative py-1.25 px-2 overflow-auto h-44 cursor-pointer"
              onClick={() => {
                if (reply) copyReply(reply);
              }}
            >
              {reply ? reply : error}
              {copied && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 rounded gap-1">
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm font-semibold text-green-600">
                    Copied!
                  </span>
                </div>
              )}
            </div>
            <div className="my-1.5 mx-0.75">
              <MdCancel
                className="cursor-pointer "
                size={18}
                onClick={() => {
                  setReply("");
                  setError("");
                  setShowReply(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TweetReplier;
