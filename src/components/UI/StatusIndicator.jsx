const StatusIndicator = ({ saveStatus, isOnline, isOfflineMode }) => {
  const getStatusInfo = () => {
    if (isOfflineMode) {
      return {
        text: "Offline Mode",
        className: "status-offline",
        icon: "🔌",
      };
    }

    if (!isOnline) {
      return {
        text: "Disconnected",
        className: "status-offline",
        icon: "📡",
      };
    }

    switch (saveStatus) {
      case "saving":
        return {
          text: "Saving...",
          className: "status-saving",
          icon: "💾",
        };
      case "saved":
        return {
          text: "Saved",
          className: "status-saved",
          icon: "✅",
        };
      case "failed":
        return {
          text: "Save Failed",
          className: "status-failed",
          icon: "⚠️",
        };
      case "offline":
        return {
          text: "Offline",
          className: "status-offline",
          icon: "🔒",
        };
      case "ready":
      default:
        return {
          text: "Ready",
          className: "status-ready",
          icon: "⚪",
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className={`status-indicator ${statusInfo.className}`}>
      <span className="status-icon">{statusInfo.icon}</span>
      <span className="status-text">{statusInfo.text}</span>
    </div>
  );
};

export default StatusIndicator;
