import React, { useState } from "react";
import { fabric } from "fabric";

const Toolbar = ({ canvas, isReady }) => {
  const [activeTool, setActiveTool] = useState("select");
  const [isDrawing, setIsDrawing] = useState(false);

  if (!canvas || !isReady) {
    return (
      <div className="toolbar">
        <div className="toolbar-loading">
          <div className="loading-spinner-small"></div>
          <span>Canvas loading...</span>
        </div>
      </div>
    );
  }

  const addRectangle = () => {
    try {
      const ctx = canvas.getContext();
      if (!ctx) {
        throw new Error("Canvas context not available");
      }

      const rect = new fabric.Rect({
        left: Math.random() * 300 + 50,
        top: Math.random() * 200 + 50,
        width: 100,
        height: 80,
        fill: "#ff6b6b",
        stroke: "#d63031",
        strokeWidth: 2,
        selectable: true,
        evented: true,
      });

      canvas.add(rect);
      canvas.setActiveObject(rect);
      canvas.renderAll();

      console.log("Rectangle added successfully");
    } catch (error) {
      console.error("Error adding rectangle:", error);
      alert("Failed to add rectangle: " + error.message);
    }
  };

  const addCircle = () => {
    try {
      console.log("Adding circle...");

      const circle = new fabric.Circle({
        left: Math.random() * 300 + 100,
        top: Math.random() * 200 + 100,
        radius: 50,
        fill: "#4ecdc4",
        stroke: "#00b894",
        strokeWidth: 2,
        selectable: true,
        evented: true,
      });

      canvas.add(circle);
      canvas.setActiveObject(circle);
      canvas.renderAll();
    } catch (error) {
      console.error("Error adding circle:", error);
      alert("Failed to add circle: " + error.message);
    }
  };

  const addText = () => {
    try {
      const text = new fabric.IText("Double click to edit", {
        left: Math.random() * 250 + 150,
        top: Math.random() * 200 + 150,
        fontSize: 20,
        fill: "#2d3436",
        fontFamily: "Arial",
        selectable: true,
        evented: true,
      });

      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();
    } catch (error) {
      console.error("Error adding text:", error);
      alert("Failed to add text: " + error.message);
    }
  };

  const toggleDrawing = () => {
    try {
      const newDrawingMode = !canvas.isDrawingMode;
      canvas.isDrawingMode = newDrawingMode;

      if (newDrawingMode) {
        canvas.freeDrawingBrush.width = 3;
        canvas.freeDrawingBrush.color = "#2d3436";
        setActiveTool("pen");
        console.log("Drawing mode enabled");
      } else {
        setActiveTool("select");
      }

      setIsDrawing(newDrawingMode);
    } catch (error) {
      console.error("Error toggling drawing mode:", error);
    }
  };

  const enableSelect = () => {
    try {
      canvas.isDrawingMode = false;
      setActiveTool("select");
      setIsDrawing(false);
    } catch (error) {
      console.error("Error enabling select mode:", error);
    }
  };

  const deleteSelected = () => {
    try {
      const activeObjects = canvas.getActiveObjects();
      if (activeObjects.length > 0) {
        activeObjects.forEach((obj) => canvas.remove(obj));
        canvas.discardActiveObject();
        canvas.renderAll();
      }
    } catch (error) {
      console.error("Error deleting objects:", error);
    }
  };

  const clearCanvas = () => {
    try {
      if (window.confirm("Are you sure you want to clear the entire canvas?")) {
        canvas.clear();
        canvas.backgroundColor = "#ffffff";
        canvas.renderAll();
        console.log("Canvas cleared");
      }
    } catch (error) {
      console.error("Error clearing canvas:", error);
    }
  };

  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <button
          className={activeTool === "select" ? "active" : ""}
          onClick={enableSelect}
          title="Select and move objects"
        >
          🔍 Select
        </button>

        <button
          className={isDrawing ? "active" : ""}
          onClick={toggleDrawing}
          title="Free drawing mode"
        >
          ✏️ {isDrawing ? "Stop" : "Draw"}
        </button>
      </div>

      <div className="toolbar-section">
        <button onClick={addRectangle} title="Add rectangle">
          ⬜ Rectangle
        </button>

        <button onClick={addCircle} title="Add circle">
          ⭕ Circle
        </button>

        <button onClick={addText} title="Add text">
          📝 Text
        </button>
      </div>

      <div className="toolbar-section">
        <button
          onClick={deleteSelected}
          className="delete-btn"
          title="Delete selected"
        >
          🗑️ Delete
        </button>

        <button
          onClick={clearCanvas}
          className="clear-btn"
          title="Clear canvas"
        >
          🆑 Clear
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
