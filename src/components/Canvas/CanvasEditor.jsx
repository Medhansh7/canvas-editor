import React, { useEffect, useRef, useState, useCallback } from "react";
import { useScene } from "../../hooks/useScene";
import { useCanvas } from "../../hooks/useCanvas";
import { useFirestore } from "../../hooks/useFirestore";
import { useOfflineDetection } from "../../hooks/useOfflineDetection";
import Toolbar from "./Toolbar";
import PropertiesPanel from "./PropertiesPanel";
import Header from "../Layout/Header";

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const CanvasEditor = () => {
  const { sceneId, isViewOnly, isOfflineMode } = useScene();
  const networkOnline = useOfflineDetection();
  const loadedRef = useRef(false);
  const [canvasError, setCanvasError] = useState(null);
  const [saveStatus, setSaveStatus] = useState("ready");
  const isSaving = useRef(false);
  const hasInitialLoad = useRef(false);

  const {
    canvasData,
    saveCanvas,
    loading: firebaseLoading,
    isOnline: firebaseOnline,
    error: firebaseError,
  } = useFirestore(isOfflineMode ? null : sceneId);

  const { canvas, selectedObject, loadCanvasData, isReady } =
    useCanvas("main-canvas");

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

  const performAutoSave = useCallback(
    async (canvasState) => {
      if (isSaving.current || isOfflineMode || !firebaseOnline) {
        return;
      }

      if (!hasInitialLoad.current) {
        hasInitialLoad.current = true;
        return;
      }

      isSaving.current = true;
      setSaveStatus("saving");

      try {
        const success = await saveCanvas(canvasState);

        if (success !== false) {
          setSaveStatus("saved");
          setTimeout(() => {
            if (!isSaving.current) {
              setSaveStatus("ready");
            }
          }, 2000);
        } else {
          setSaveStatus("offline");
        }
      } catch (error) {
        setSaveStatus("failed");
        console.error("❌ Auto-save error:", error);

        setTimeout(() => {
          if (!isSaving.current) {
            setSaveStatus("ready");
          }
        }, 3000);
      }

      isSaving.current = false;
    },
    [saveCanvas, isOfflineMode, firebaseOnline]
  );

  const debouncedAutoSave = useCallback(
    debounce((canvasState) => {
      performAutoSave(canvasState);
    }, 2000),
    [performAutoSave]
  );

  const handleManualSave = async () => {
    if (!canvas || !isReady) return;

    debouncedAutoSave.cancel && debouncedAutoSave.cancel();

    isSaving.current = true;
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
      setTimeout(() => setSaveStatus("ready"), 3000);
    }

    isSaving.current = false;
  };

  useEffect(() => {
    if (!canvas || !isReady || isViewOnly || isOfflineMode) {
      return;
    }

    const handleCanvasChange = (eventType) => {
      const canvasState = canvas.toJSON(["selectable", "evented"]);
      debouncedAutoSave(canvasState);
    };
    const autoSaveEvents = [
      "object:added",
      "object:removed",
      "object:modified",
      "object:scaling",
      "object:moving",
      "object:rotating",
      "text:changed",
      "path:created",
    ];

    autoSaveEvents.forEach((event) => {
      canvas.on(event, () => handleCanvasChange(event));
    });

    return () => {
      autoSaveEvents.forEach((event) => {
        canvas.off(event, () => handleCanvasChange(event));
      });
    };
  }, [canvas, isReady, isViewOnly, isOfflineMode, debouncedAutoSave]);

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

      {!effectiveOfflineMode && !isViewOnly && (
        <div className="autosave-indicator">
          <span className="autosave-text">
            {saveStatus === "saving" && "💾 Auto-saving..."}
            {saveStatus === "saved" && "✅ Auto-saved"}
            {saveStatus === "failed" && "⚠️ Save failed"}
          </span>
        </div>
      )}
    </div>
  );
};

export default CanvasEditor;
