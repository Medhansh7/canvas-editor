import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { db, isFirebaseReady } from "../firebase";

export const useFirestore = (sceneId) => {
  const [canvasData, setCanvasData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sceneId || !isFirebaseReady()) {
      setLoading(false);
      setIsOnline(false);
      return;
    }
    setLoading(true);
    const docRef = doc(db, "canvases", sceneId);

    const loadInitialData = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const parsedCanvasData =
            typeof data.canvasState === "string"
              ? JSON.parse(data.canvasState)
              : data.canvasState;
          setCanvasData(parsedCanvasData);
        }
        setIsOnline(true);
        setError(null);
      } catch (error) {
        console.warn("Failed to load canvas:", error);
        setIsOnline(false);
        setError(error.message);
      }
      setLoading(false);
    };

    loadInitialData();

    const unsubscribe = onSnapshot(
      docRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          const parsedCanvasData =
            typeof data.canvasState === "string"
              ? JSON.parse(data.canvasState)
              : data.canvasState;
          setCanvasData(parsedCanvasData);
        }
        setIsOnline(true);
      },
      (error) => {
        console.warn("Firestore listener error:", error);
        setIsOnline(false);
        setError(error.message);
      }
    );

    return () => unsubscribe();
  }, [sceneId]);

  const saveCanvas = async (canvasState) => {
    if (!sceneId || !isFirebaseReady()) {
      console.log("Cannot save: no sceneId or Firebase not ready");
      return false;
    }

    try {
      const canvasStateString = JSON.stringify(canvasState);

      await setDoc(
        doc(db, "canvases", sceneId),
        {
          canvasState: canvasStateString,
          lastModified: new Date(),
          sceneId,
        },
        { merge: true }
      );
      setError(null);
      setIsOnline(true);
      return true;
    } catch (error) {
      console.warn("Save failed:", error);
      setError(error.message);
      setIsOnline(false);
      return false;
    }
  };

  return { canvasData, saveCanvas, loading, isOnline, error };
};
