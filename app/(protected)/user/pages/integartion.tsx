"use client";
import React, { useState } from "react";
import { Integration, IntegrationStatus } from "@/types/int";
import IntegrationCard from "./_comps/integration-card";

export const integrationsList: Integration[] = [
  {
    id: "twitter",
    name: "Twitter",
    description:
      "Connect with your Twitter account to share updates and engage with followers.",
    icon: "twitter",
    status: "connected",
    lastConnected: "2025-05-10T14:30:00Z",
    enabled: true
  },
  {
    id: "facebook",
    name: "Facebook",
    description:
      "Link your Facebook page to share content and track engagement metrics.",
    icon: "facebook",
    status: "disconnected",
    lastConnected: "2025-04-22T09:15:00Z",
    enabled: false
  },
  {
    id: "instagram",
    name: "Instagram",
    description:
      "Integrate with Instagram to manage your profile and analyze performance.",
    icon: "instagram",
    status: "pending",
    enabled: true
  }
];

const Integrations = () => {
  const [integrations, setIntegrations] =
    useState<Integration[]>(integrationsList);

  const handleToggle = (id: string, enabled: boolean) => {
    setIntegrations((prevIntegrations) =>
      prevIntegrations.map((integration) =>
        integration.id === id ? { ...integration, enabled } : integration
      )
    );
  };

  const handleConnect = (id: string) => {
    setIntegrations((prevIntegrations) =>
      prevIntegrations.map((integration) => {
        if (integration.id === id) {
          const currentStatus = integration.status;

          // If currently disconnected, set to pending
          if (currentStatus === "disconnected") {
            return { ...integration, status: "pending" as IntegrationStatus };
          }

          // If currently connected, simulate reconnection process
          if (currentStatus === "connected") {
            return { ...integration, status: "pending" as IntegrationStatus };
          }
        }
        return integration;
      })
    );

    // Simulate connection process
    setTimeout(() => {
      setIntegrations((prevIntegrations) =>
        prevIntegrations.map((integration) => {
          if (integration.id === id && integration.status === "pending") {
            const now = new Date().toISOString();
            return {
              ...integration,
              status: "connected" as IntegrationStatus,
              lastConnected: now
            };
          }
          return integration;
        })
      );
    }, 2000);
  };

  return (
    <div className="p-6 border-l bg-white border-l-zinc-200 ml-5 rounded-md h-screen">
      <div className="grid gap-6 md:grid-cols-1 lg:gap-8">
        {integrations.map((integration) => (
          <IntegrationCard
            key={integration.id}
            integration={integration}
            onToggle={handleToggle}
            onConnect={handleConnect}
          />
        ))}
      </div>
    </div>
  );
};

export default Integrations;
