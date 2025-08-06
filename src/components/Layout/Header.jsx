import React, { useState } from "react";
import ShareModal from "./ShareModal";
import StatusIndicator from "../UI/StatusIndicator";

const Header = ({ sceneId, isOfflineMode, saveStatus, isOnline, onSave }) => {
  const [showShareModal, setShowShareModal] = useState(false);

  const handleNewCanvas = () => {
    const newId =
      Date.now().toString(36) + Math.random().toString(36).substr(2);
    window.location.href = `/canvas/${newId}`;
  };

  const handleExport = () => {
    const canvas = window.fabricCanvas;
    if (canvas) {
      const dataURL = canvas.toDataURL({
        format: "png",
        quality: 1.0,
        multiplier: 2,
      });
      const link = document.createElement("a");
      link.download = `canvas-${Date.now()}.png`;
      link.href = dataURL;
      link.click();
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1>🎨 Canvas Editor</h1>
          <div className="header-status-pills">
            <StatusIndicator
              saveStatus={saveStatus}
              isOnline={isOnline}
              isOfflineMode={isOfflineMode}
            />
            <div
              className={`firebase-status ${
                isOnline ? "status-saved" : "status-offline"
              }`}
            >
              <span className="status-icon">{isOnline ? "🟢" : "🔴"}</span>
              <span className="status-text">
                Firebase {isOnline ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>
        </div>
        <div className="header-actions">
          {!isOfflineMode && sceneId && (
            <button
              className="share-btn"
              onClick={() => setShowShareModal(true)}
            >
              📤 Share
            </button>
          )}

          <button className="new-canvas-btn" onClick={handleNewCanvas}>
            ➕ New
          </button>

          <button className="export-btn" onClick={handleExport}>
            💾 Export
          </button>
          {!isOfflineMode && sceneId && (
            <button className="save-btn" onClick={onSave}>
              💾 Save
            </button>
          )}
        </div>
      </div>

      {!isOfflineMode && sceneId && (
        <ShareModal
          sceneId={sceneId}
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </header>
  );
};

export default Header;
