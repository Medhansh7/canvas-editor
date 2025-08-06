// src/hooks/useCanvas.js - Alternative simplified version
import { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";

export const useCanvas = (canvasId) => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let timeoutId;
    let retryCount = 0;
    const maxRetries = 5;

    const tryInitialize = async () => {
      try {
        // Wait for DOM element
        const element = document.getElementById(canvasId);
        if (!element) {
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(
              `Canvas element not found, retry ${retryCount}/${maxRetries}`
            );
            timeoutId = setTimeout(tryInitialize, 500);
          }
          return;
        }

        // Clean up existing canvas
        if (canvasRef.current) {
          canvasRef.current.dispose();
          canvasRef.current = null;
        }

        // Get dimensions
        const container = element.parentElement;
        const width = container
          ? Math.max(container.clientWidth - 40, 600)
          : 800;
        const height = container
          ? Math.max(container.clientHeight - 40, 400)
          : 600;

        console.log(`Creating canvas: ${width}x${height}`);

        // Create fabric canvas
        const fabricCanvas = new fabric.Canvas(canvasId, {
          width,
          height,
          backgroundColor: "#ffffff",
          selection: true,
          preserveObjectStacking: true,
        });

        // Event listeners
        fabricCanvas.on("selection:created", (e) => {
          setSelectedObject(e.selected[0]);
        });

        fabricCanvas.on("selection:updated", (e) => {
          setSelectedObject(e.selected[0]);
        });

        fabricCanvas.on("selection:cleared", () => {
          setSelectedObject(null);
        });

        // Store references
        canvasRef.current = fabricCanvas;
        setCanvas(fabricCanvas);
        setIsReady(true);
        window.fabricCanvas = fabricCanvas;

        console.log("Canvas initialized successfully!");
      } catch (error) {
        console.error("Canvas initialization failed:", error);
        if (retryCount < maxRetries) {
          retryCount++;
          timeoutId = setTimeout(tryInitialize, 1000);
        }
      }
    };

    // Start initialization
    timeoutId = setTimeout(tryInitialize, 100);

    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (canvasRef.current) {
        canvasRef.current.dispose();
        canvasRef.current = null;
      }
      setCanvas(null);
      setIsReady(false);
    };
  }, [canvasId]);

  const loadCanvasData = (data) => {
    if (!canvas || !data || !isReady) return;

    try {
      canvas.loadFromJSON(data, () => {
        canvas.renderAll();
      });
    } catch (error) {
      console.error("Error loading canvas data:", error);
    }
  };

  return {
    canvas,
    selectedObject,
    canvasRef,
    loadCanvasData,
    isReady,
  };
};
