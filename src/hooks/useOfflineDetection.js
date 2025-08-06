import { useState, useEffect } from "react";

export const useOfflineDetection = () => {
  const [networkStatus, setNetworkStatus] = useState({
    isOnline: navigator.onLine,
    lastUpdated: Date.now(),
    connectionType: navigator?.connection?.type || "unknown",
  });

  useEffect(() => {
    const updateStatus = () => {
      setNetworkStatus((prev) => ({
        ...prev,
        isOnline: navigator.onLine,
        lastUpdated: Date.now(),
        connectionType: navigator?.connection?.type || "unknown",
      }));
    };

    const handleOnline = () => updateStatus();
    const handleOffline = () => updateStatus();
    const handleConnectionChange = () => updateStatus();

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Add connection type detection if supported
    if (navigator.connection) {
      navigator.connection.addEventListener("change", handleConnectionChange);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (navigator.connection) {
        navigator.connection.removeEventListener(
          "change",
          handleConnectionChange
        );
      }
    };
  }, []);

  return networkStatus;
};
