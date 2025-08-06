import { useState, useEffect } from "react";
const PropertiesPanel = ({ object, canvas }) => {
  const [properties, setProperties] = useState({
    fill: "#000000",
    stroke: "#000000",
    strokeWidth: 1,
    opacity: 1,
  });

  useEffect(() => {
    if (object) {
      setProperties({
        fill: object.fill || "#000000",
        stroke: object.stroke || "#000000",
        strokeWidth: object.strokeWidth || 1,
        opacity: object.opacity || 1,
      });
    }
  }, [object]);

  if (!object || !canvas) return null;

  const updateProperty = (key, value) => {
    object.set(key, value);
    canvas.renderAll();
    setProperties((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="properties-panel">
      <h3>Properties</h3>

      {object.type !== "path" && (
        <div className="property-group">
          <label>Fill Color:</label>
          <input
            type="color"
            value={properties.fill}
            onChange={(e) => updateProperty("fill", e.target.value)}
          />
        </div>
      )}

      <div className="property-group">
        <label>Stroke Color:</label>
        <input
          type="color"
          value={properties.stroke}
          onChange={(e) => updateProperty("stroke", e.target.value)}
        />
      </div>

      <div className="property-group">
        <label>Stroke Width: {properties.strokeWidth}px</label>
        <input
          type="range"
          min="0"
          max="20"
          value={properties.strokeWidth}
          onChange={(e) =>
            updateProperty("strokeWidth", parseInt(e.target.value))
          }
        />
      </div>

      <div className="property-group">
        <label>Opacity: {Math.round(properties.opacity * 100)}%</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={properties.opacity}
          onChange={(e) =>
            updateProperty("opacity", parseFloat(e.target.value))
          }
        />
      </div>

      {object.type === "i-text" && (
        <div className="property-group">
          <label>Font Size:</label>
          <input
            type="range"
            min="10"
            max="72"
            value={object.fontSize || 20}
            onChange={(e) =>
              updateProperty("fontSize", parseInt(e.target.value))
            }
          />
        </div>
      )}
    </div>
  );
};

export default PropertiesPanel;
