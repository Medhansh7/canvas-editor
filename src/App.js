import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import CanvasEditor from "./components/Canvas/CanvasEditor";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={`/canvas/${uuidv4()}`} replace />}
        />
        <Route path="/canvas/offline" element={<CanvasEditor />} />
        <Route path="/canvas/:id" element={<CanvasEditor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
