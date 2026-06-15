import { useEffect, useState } from "react";
import browser from "webextension-polyfill";
import "./Popup.css";

interface Settings {
  prompt: string;
  model: string;
  apiUrl: string;
}

const STORAGE_KEY = "tweet_replier_settings";

const defaults: Settings = {
  prompt: "Generate a reply for this tweet as a twitter user.",
  model: "deepseek-r1:1.5b",
  apiUrl: "http://localhost:11434/api/generate",
};

export default function Popup() {
  const [settings, setSettings] = useState<Settings>(defaults);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    browser.storage.local.get(STORAGE_KEY).then((result) => {
      if (result[STORAGE_KEY]) {
        setSettings(result[STORAGE_KEY] as Settings);
      }
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setSettings((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await browser.storage.local.set({ [STORAGE_KEY]: settings });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="popup">
      <div className="header">
        <div className="logo">
          <svg viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
          </svg>
        </div>
        <span className="header-title">Tweet Replier</span>
      </div>

      <div className="divider" />

      <form className="form" onSubmit={handleSave}>
        <div className="field">
          <span className="field-label">API URL</span>
          <input
            name="apiUrl"
            value={settings.apiUrl}
            onChange={handleChange}
            placeholder="http://localhost:11434/api/generate"
          />
        </div>

        <div className="field">
          <span className="field-label">Model</span>
          <input
            name="model"
            value={settings.model}
            onChange={handleChange}
            placeholder="deepseek-r1:1.5b"
          />
        </div>

        <div className="field">
          <span className="field-label">
            Prompt - <code>{"${tweetText}"}</code> anywhere in your prompt to
            insert the tweet text.
          </span>
          <textarea
            name="prompt"
            value={settings.prompt}
            onChange={handleChange}
            rows={4}
            placeholder="Generate a reply for this tweet..."
          />
        </div>

        <button type="submit" className="save-btn">
          {saved ? "Saved ✓" : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
