import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export const useScene = () => {
  const { id } = useParams();
  const location = useLocation();
  const [isViewOnly, setIsViewOnly] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    setIsViewOnly(urlParams.get("viewOnly") === "true");
  }, [location.search]);

  const sceneId = id === "offline" ? null : id;
  const isOfflineMode = sceneId === null;

  return { sceneId, isViewOnly, isOfflineMode };
};
