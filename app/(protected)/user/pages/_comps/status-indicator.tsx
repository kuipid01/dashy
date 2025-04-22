import { IntegrationStatus } from "@/types/int";
import React from "react";

interface StatusIndicatorProps {
  status: IntegrationStatus;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "connected":
        return {
          bg: "bg-emerald-500",
          text: "text-emerald-800",
          border: "border-emerald-300",
          bgContainer: "bg-emerald-50",
          label: "Connected"
        };
      case "disconnected":
        return {
          bg: "bg-red-500",
          text: "text-red-800",
          border: "border-red-300",
          bgContainer: "bg-red-50",
          label: "Disconnected"
        };
      case "pending":
        return {
          bg: "bg-amber-500",
          text: "text-amber-800",
          border: "border-amber-300",
          bgContainer: "bg-amber-50",
          label: "Pending"
        };
      default:
        return {
          bg: "bg-gray-400",
          text: "text-gray-800",
          border: "border-gray-300",
          bgContainer: "bg-gray-50",
          label: "Unknown"
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <div
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles.border} ${styles.bgContainer} ${styles.text} transition-all duration-300`}
    >
      <div
        className={`w-2 h-2 rounded-full ${styles.bg} mr-1.5 animate-pulse`}
      ></div>
      {styles.label}
    </div>
  );
};

export default StatusIndicator;
