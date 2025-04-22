import React from "react";
// import * as Icons from "lucide-react";
import { Integration } from "@/types/int";
import StatusIndicator from "./status-indicator";

interface IntegrationCardProps {
  integration: Integration;
  onToggle: (id: string, enabled: boolean) => void;
  onConnect: (id: string) => void;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  integration,
  onToggle,
  onConnect
}) => {
  // Dynamically get the icon component
  // const IconComponent = Icons[integration.icon as keyof typeof Icons];

  const handleToggle = () => {
    onToggle(integration.id, !integration.enabled);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never";

    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };

  return (
    <div
      className={`bg-white rounded-xl border p-6 transition-all duration-300 hover:shadow-md ${
        integration.enabled ? "border-gray-200" : "border-gray-200 opacity-75"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div
            className={`p-3 rounded-lg ${
              integration.status === "connected"
                ? "bg-emerald-50 text-emerald-600"
                : integration.status === "disconnected"
                ? "bg-red-50 text-red-600"
                : "bg-amber-50 text-amber-600"
            }`}
          >
            {/* {IconComponent && <IconComponent size={24} />} */}
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {integration.name}
            </h3>
            <StatusIndicator status={integration.status} />
          </div>
        </div>

        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={integration.enabled}
            onChange={handleToggle}
            className="sr-only peer"
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      <p className="mt-3 text-sm text-gray-600">{integration.description}</p>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Last connected:{" "}
            <span className="font-medium">
              {formatDate(integration.lastConnected)}
            </span>
          </div>

          <button
            onClick={() => onConnect(integration.id)}
            disabled={integration.status === "pending" || !integration.enabled}
            className={`text-sm px-4 py-2 rounded-lg transition-all duration-200 ${
              integration.status === "connected"
                ? "bg-gray-100 hover:bg-gray-200 text-gray-800"
                : integration.status === "pending" || !integration.enabled
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-100 hover:bg-blue-200 text-blue-800"
            }`}
          >
            {integration.status === "connected"
              ? "Reconnect"
              : integration.status === "pending"
              ? "Connecting..."
              : "Connect"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntegrationCard;
