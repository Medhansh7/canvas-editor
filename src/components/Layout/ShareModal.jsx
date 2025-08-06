import React, { useState } from "react";

const ShareModal = ({ sceneId, isOpen, onClose }) => {
  const [copied, setCopied] = useState("");

  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/canvas/${sceneId}`;
  const viewOnlyUrl = `${shareUrl}?viewOnly=true`;

  const copyToClipboard = async (url, type) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(type);
      setTimeout(() => setCopied(""), 2000);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(type);
      setTimeout(() => setCopied(""), 2000);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>📤 Share Canvas</h2>

        <div className="share-option">
          <label>🔗 Edit Link (Anyone can edit):</label>
          <div className="url-container">
            <input type="text" value={shareUrl} readOnly />
            <button
              onClick={() => copyToClipboard(shareUrl, "edit")}
              className={copied === "edit" ? "copied" : ""}
            >
              {copied === "edit" ? "✅ Copied!" : "📋 Copy"}
            </button>
          </div>
        </div>

        <div className="share-option">
          <label>👁️ View-Only Link:</label>
          <div className="url-container">
            <input type="text" value={viewOnlyUrl} readOnly />
            <button
              onClick={() => copyToClipboard(viewOnlyUrl, "view")}
              className={copied === "view" ? "copied" : ""}
            >
              {copied === "view" ? "✅ Copied!" : "📋 Copy"}
            </button>
          </div>
        </div>

        <button className="close-btn" onClick={onClose}>
          ❌ Close
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
