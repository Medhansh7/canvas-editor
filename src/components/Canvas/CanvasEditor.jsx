import React, { useEffect, useRef, useState } from "react";
import { useScene } from "../../hooks/useScene";
import { useCanvas } from "../../hooks/useCanvas";
import { useFirestore } from "../../hooks/useFirestore";

import { useOfflineDetection } from "../../hooks/useOfflineDetection";
import Toolbar from "./Toolbar";
import PropertiesPanel from "./PropertiesPanel";
import Header from "../Layout/Header";

const CanvasEditor = () => {
  const { sceneId, isViewOnly, isOfflineMode } = useScene();
  const networkOnline = useOfflineDetection();
  const loadedRef = useRef(false);
  const [canvasError, setCanvasError] = useState(null);

  const {
    canvasData,
    saveCanvas,
    loading: firebaseLoading,
    isOnline: firebaseOnline,
    error: firebaseError,
  } = useFirestore(isOfflineMode ? null : sceneId);

  const { canvas, selectedObject, loadCanvasData, isReady } =
    useCanvas("main-canvas");

  const [saveStatus, setSaveStatus] = useState("ready");
  useEffect(() => {
    if (!isReady && canvas === null) {
      const timer = setTimeout(() => {
        setCanvasError("Canvas failed to initialize. Please refresh the page.");
      }, 10000);

      return () => clearTimeout(timer);
    } else if (isReady) {
      setCanvasError(null);
    }
  }, [isReady, canvas]);

  const handleManualSave = async () => {
    if (!canvas || !isReady) return;

    setSaveStatus("saving");
    try {
      const json = canvas.toJSON(["selectable", "evented"]);
      const ok = await saveCanvas(json);

      if (ok !== false) {
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("ready"), 1500);
      } else {
        setSaveStatus("offline");
      }
    } catch (err) {
      console.error("Save failed:", err);
      setSaveStatus("failed");
    }
  };
  //
  useEffect(() => {
    if (canvas && isReady && canvasData && !loadedRef.current) {
      loadedRef.current = true;
      setTimeout(() => {
        loadCanvasData(canvasData);
      }, 200);
    }
  }, [canvas, isReady, canvasData, loadCanvasData]);

  useEffect(() => {
    if (canvas && isReady && isViewOnly) {
      canvas.selection = false;
      canvas.forEachObject((obj) => {
        obj.selectable = false;
        obj.evented = false;
      });
      canvas.renderAll();
    }
  }, [canvas, isReady, isViewOnly]);

  const effectiveOfflineMode =
    isOfflineMode || !firebaseOnline || !!firebaseError;

  if (firebaseLoading && !isOfflineMode) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading canvas data...</p>
      </div>
    );
  }

  if (canvasError) {
    return (
      <div className="error-screen">
        <div className="error-icon">⚠️</div>
        <h2>Canvas Error</h2>
        <p>{canvasError}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          🔄 Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className="canvas-editor-container">
      <Header
        sceneId={sceneId}
        isOfflineMode={effectiveOfflineMode}
        saveStatus={saveStatus}
        isOnline={networkOnline && firebaseOnline}
        onSave={handleManualSave}
      />

      {!isViewOnly && <Toolbar canvas={canvas} isReady={isReady} />}

      <div className="canvas-main-area">
        <div className="canvas-wrapper-fullscreen">
          {!isReady && (
            <div className="canvas-loading-overlay">
              <div className="loading-spinner"></div>
              <p>Initializing canvas...</p>
            </div>
          )}
          <canvas
            id="main-canvas"
            style={{
              opacity: isReady ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          />
        </div>

        {!isViewOnly && selectedObject && isReady && (
          <PropertiesPanel object={selectedObject} canvas={canvas} />
        )}
      </div>

      {effectiveOfflineMode && (
        <div className="offline-banner">
          <span>🔌 Offline Mode - Changes not saved automatically</span>
        </div>
      )}
    </div>
  );
};

export default CanvasEditor;
