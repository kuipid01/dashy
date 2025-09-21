/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Store } from "@/types/store";
import { Store  as StoreIcon, MapPin, Mail, Phone } from "lucide-react";

export interface StoreActivationRequirement {
  valid: boolean;
  label: string;
  icon: any;
}

export interface StoreActivationStatus {
  requirements: Record<string, StoreActivationRequirement>;
  validCount: number;
  totalCount: number;
  isFullyActivated: boolean;
  activationPercentage: number;
}

export interface StoreData {
  storeName?: string;
  state?: string;
  country?: string;
  phone_number?: string;
  lat?: string;
  lon?: string;
}

/**
 * Validates if a store name meets the minimum requirements
 */
export const validateStoreName = (storeName?: string): boolean => {
  return !!(storeName && storeName.length >= 4);
};

/**
 * Validates if coordinates are present and valid
 */
export const validateCoordinates = (lat?: string, lon?: string): boolean => {
  return !!(lat && lon && !isNaN(Number(lat)) && !isNaN(Number(lon)));
};

/**
 * Validates if a state is provided
 */
export const validateState = (state?: string): boolean => {
  return !!state;
};

/**
 * Validates if a country is provided
 */
export const validateCountry = (country?: string): boolean => {
  return !!country;
};

/**
 * Validates if an email is provided and has correct format
 */
export const validateEmail = (email?: string): boolean => {
  return !!(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
};

/**
 * Validates if a phone number is provided
 */
export const validatePhone = (phone?: string): boolean => {
  return !!phone;
};

/**
 * Gets the activation status for a store based on provided data
 * @param storeData - The store data to validate
 * @param nameValid - Optional flag to indicate if the store name is valid (for form validation)
 * @returns StoreActivationStatus object with validation results
 */
export const getStoreActivationStatus = (
  storeData: StoreData,
  nameValid: boolean = true
): StoreActivationStatus => {
  console.log("[Activation Check] Incoming store data:", storeData);

  const {
    storeName,
    state,
    country,
    phone_number,
    lat,
    lon
  } = storeData;

  const requirements = {
    storeName: {
      valid: nameValid && validateStoreName(storeName),
      label: "Store Name",
      icon: StoreIcon
    },
    coordinates: {
      valid: validateCoordinates(lat, lon),
      label: "Location Coordinates",
      icon: MapPin
    },
    state: {
      valid: validateState(state),
      label: "State",
      icon: MapPin
    },
    country: {
      valid: validateCountry(country),
      label: "Country",
      icon: MapPin
    },
    phone: {
      valid: validatePhone(phone_number),
      label: "Phone Number",
      icon: Phone
    }
  };

  // Log each requirement’s status
  Object.entries(requirements).forEach(([key, req]) => {
    console.log(`[Activation Check] ${req.label}: ${req.valid ? "✅ valid" : "❌ invalid"}`);
  });

  const validCount = Object.values(requirements).filter(
    (req) => req.valid
  ).length;
  const totalCount = Object.keys(requirements).length;
  const isFullyActivated = validCount === totalCount;
  const activationPercentage = Math.round((validCount / totalCount) * 100);

  console.log("[Activation Summary]", {
    validCount,
    totalCount,
    isFullyActivated,
    activationPercentage
  });

  return { 
    requirements, 
    validCount, 
    totalCount, 
    isFullyActivated,
    activationPercentage
  };
};


/**
 * Gets the activation status for a Store object
 * @param store - The Store object to validate
 * @returns StoreActivationStatus object with validation results
 */
export const getStoreActivationStatusFromStore = (store: Store): StoreActivationStatus => {
  const storeData: StoreData = {
    storeName: store.name,
    state: store.state,
    country: store.country,
    phone_number: store.phone_number,
    lat: store.lat,
    lon: store.lon
  };

  return getStoreActivationStatus(storeData);
};

/**
 * Checks if a store is active and fully activated
 * @param store - The Store object to check
 * @returns boolean indicating if store is active and fully activated
 */
export const isStoreActiveAndActivated = (store: Store): boolean => {

  console.log(store, getStoreActivationStatusFromStore(store).isFullyActivated)
  return getStoreActivationStatusFromStore(store).isFullyActivated;
};

/**
 * Gets a human-readable activation status message
 * @param status - The StoreActivationStatus object
 * @returns string with activation status message
 */
export const getActivationStatusMessage = (status: StoreActivationStatus): string => {
  if (status.isFullyActivated) {
    return "Store is fully activated and ready for business";
  }
  
  const remaining = status.totalCount - status.validCount;
  if (remaining === 1) {
    return "1 requirement remaining to activate your store";
  }
  
  return `${remaining} requirements remaining to activate your store`;
};

/**
 * Gets the activation status color for UI display
 * @param status - The StoreActivationStatus object
 * @returns string with appropriate color class
 */
export const getActivationStatusColor = (status: StoreActivationStatus): string => {
  if (status.isFullyActivated) {
    return "text-green-600";
  }
  
  if (status.activationPercentage >= 75) {
    return "text-yellow-600";
  }
  
  if (status.activationPercentage >= 50) {
    return "text-orange-600";
  }
  
  return "text-red-600";
};
