import { useMemo } from "react";
import { Store } from "@/types/store";
import { 
  getStoreActivationStatus, 
  getStoreActivationStatusFromStore,
  isStoreActiveAndActivated,
  getActivationStatusMessage,
  getActivationStatusColor,
  StoreData,
} from "@/lib/store-validation";

/**
 * Custom hook for managing store activation status
 * @param storeData - The store data to validate
 * @param nameValid - Optional flag to indicate if the store name is valid
 * @returns StoreActivationStatus object with validation results and helper functions
 */
export const useStoreActivation = (
  storeData: StoreData,
  nameValid: boolean = true
) => {
  const status = useMemo(() => {
    return getStoreActivationStatus(storeData, nameValid);
  }, [storeData, nameValid]);

  const message = useMemo(() => {
    return getActivationStatusMessage(status);
  }, [status]);

  const color = useMemo(() => {
    return getActivationStatusColor(status);
  }, [status]);

  return {
    ...status,
    message,
    color
  };
};

/**
 * Custom hook for managing store activation status from a Store object
 * @param store - The Store object to validate
 * @returns StoreActivationStatus object with validation results and helper functions
 */
export const useStoreActivationFromStore = (store: Store | undefined) => {
  const status = useMemo(() => {
    if (!store) {
      return {
        requirements: {},
        validCount: 0,
        totalCount: 0,
        isFullyActivated: false,
        activationPercentage: 0,
        message: "Store not found",
        color: "text-red-600"
      };
    }
    return getStoreActivationStatusFromStore(store);
  }, [store]);

  const message = useMemo(() => {
    if (!store) return "Store not found";
    return getActivationStatusMessage(status);
  }, [status, store]);

  const color = useMemo(() => {
    if (!store) return "text-red-600";
    return getActivationStatusColor(status);
  }, [status, store]);

  const isActiveAndActivated = useMemo(() => {
    if (!store) return false;
    return isStoreActiveAndActivated(store);
  }, [store]);

  return {
    ...status,
    message,
    color,
    isActiveAndActivated
  };
};

/**
 * Custom hook for checking if a store is ready for business
 * @param store - The Store object to check
 * @returns boolean indicating if store is ready for business
 */
export const useStoreReady = (store: Store | undefined) => {
  return useMemo(() => {
    if (!store) return false;
    return isStoreActiveAndActivated(store);
  }, [store]);
};
