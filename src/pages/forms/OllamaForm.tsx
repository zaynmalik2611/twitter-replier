// import React, { useState } from "react";
// import browser from "webextension-polyfill";
// // import { Settings, STORAGE_KEY } from "../Popup";

// // interface OllamaFormProps {
// //   setSettings: React.Dispatch<React.SetStateAction<Settings>>;
// //   settings: Settings;
// // }

// function OllamaForm({ setSettings, settings }: OllamaFormProps) {
//   const [saved, setSaved] = useState(false);
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//   ) => {
//     setSettings((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await browser.storage.local.set({ [STORAGE_KEY]: settings });
//     setSaved(true);
//     setTimeout(() => setSaved(false), 2000);
//   };

//   return (
//     <form className="form" onSubmit={handleSave}>
//       <div className="field">
//         <span className="field-label">API URL</span>
//         <input
//           name="apiUrl"
//           value={settings.apiUrl}
//           onChange={handleChange}
//           placeholder="http://localhost:11434/api/generate"
//         />
//       </div>

//       <div className="field">
//         <span className="field-label">Model</span>
//         <input
//           name="model"
//           value={settings.model}
//           onChange={handleChange}
//           placeholder="deepseek-r1:1.5b"
//         />
//       </div>

//       <div className="field">
//         <span className="field-label">
//           Prompt - <code>{"${tweetText}"}</code> anywhere in your prompt to
//           insert the tweet text.
//         </span>
//         <textarea
//           name="prompt"
//           value={settings.prompt}
//           onChange={handleChange}
//           rows={4}
//           placeholder="Generate a reply for this tweet..."
//         />
//       </div>

//       <button type="submit" className="save-btn">
//         {saved ? "Saved ✓" : "Save Settings"}
//       </button>
//     </form>
//   );
// }

// export default OllamaForm;
