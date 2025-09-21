"use client";
import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Store,
  MapPin,
  Mail,
  Phone
} from "lucide-react";
import { useStoreActivationFromStore } from "@/lib/hooks/use-store-activation";
import { Store as StoreType } from "@/types/store";

interface StoreActivationStatusProps {
  store?: StoreType;
  showDetails?: boolean;
  className?: string;
}

const StoreActivationStatus: React.FC<StoreActivationStatusProps> = ({
  store,
  showDetails = false,
  className = ""
}) => {
  const storeActivation = useStoreActivationFromStore(store);

  if (!store) {
    return (
      <div className={`p-4 bg-gray-100 rounded-lg border ${className}`}>
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-gray-500" />
          <span className="text-sm text-gray-500">Store not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-white rounded-lg border shadow-sm ${className}`}>
      {/* Status Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {storeActivation.isFullyActivated ? (
            <CheckCircle2 size={18} className="text-green-600" />
          ) : (
            <AlertTriangle size={18} className="text-yellow-600" />
          )}
          <span className={`font-medium ${storeActivation.color}`}>
            Store Status
          </span>
        </div>
        <span className={`text-sm font-medium ${storeActivation.color}`}>
          {storeActivation.activationPercentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              storeActivation.isFullyActivated
                ? "bg-green-500"
                : storeActivation.activationPercentage >= 75
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{ width: `${storeActivation.activationPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Status Message */}
      <p className="text-sm text-gray-600 mb-3">{storeActivation.message}</p>

      {/* Detailed Requirements */}
      {showDetails && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Requirements ({storeActivation.validCount}/
            {storeActivation.totalCount})
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(storeActivation.requirements).map(
              ([key, requirement]) => {
                const Icon = requirement.icon;
                return (
                  <div key={key} className="flex items-center gap-2 text-sm">
                    <Icon
                      size={14}
                      className={
                        requirement.valid ? "text-green-600" : "text-gray-400"
                      }
                    />
                    <span
                      className={
                        requirement.valid ? "text-gray-700" : "text-gray-500"
                      }
                    >
                      {requirement.label}
                    </span>
                    {requirement.valid && (
                      <CheckCircle2
                        size={12}
                        className="text-green-600 ml-auto"
                      />
                    )}
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}

      {/* Store Active Status */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Store Active</span>
          <span
            className={`text-sm font-medium ${
              store.is_active ? "text-green-600" : "text-red-600"
            }`}
          >
            {store.is_active ? "Yes" : "No"}
          </span>
        </div>
        {storeActivation.isActiveAndActivated && (
          <div className="mt-2 p-2 bg-green-50 rounded-md">
            <p className="text-xs text-green-700 font-medium">
              ✓ Store is fully activated and ready for business
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreActivationStatus;
