import Skeleton from "@/app/(general)/_compoenents/skeleton";
import { InputComponent } from "@/app/(protected)/_components/input-component";
import React, { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { COUNTRIES, NIGERIAN_STATES } from "@/constants/mock_data";
import { useFetchLocations } from "@/app/(handlers)/externals/ng-data/ng-data";
import { Location } from "@/constants/types";
import { MapPin, Search, X, AlertCircle, CheckCircle2 } from "lucide-react";

// Nigerian state coordinates (approximate center points)
const nigerianStateCoordinates: Record<string, { lat: string; lon: string }> = {
  Abia: { lat: "5.5320", lon: "7.4860" },
  Adamawa: { lat: "9.3265", lon: "12.3981" },
  "Akwa Ibom": { lat: "4.9057", lon: "7.8537" },
  Anambra: { lat: "6.2107", lon: "6.9369" },
  Bauchi: { lat: "10.3158", lon: "9.8442" },
  Bayelsa: { lat: "4.9267", lon: "6.2676" },
  Benue: { lat: "7.3369", lon: "8.7404" },
  Borno: { lat: "11.8333", lon: "13.1500" },
  "Cross River": { lat: "5.8702", lon: "8.5988" },
  Delta: { lat: "5.5320", lon: "5.8987" },
  Ebonyi: { lat: "6.2649", lon: "8.0137" },
  Edo: { lat: "6.3407", lon: "5.6204" },
  Ekiti: { lat: "7.6333", lon: "5.2167" },
  Enugu: { lat: "6.4413", lon: "7.4988" },
  "Federal Capital Territory": { lat: "9.0765", lon: "7.3986" },
  Gombe: { lat: "10.2897", lon: "11.1713" },
  Imo: { lat: "5.4920", lon: "7.0260" },
  Jigawa: { lat: "12.0000", lon: "9.7500" },
  Kaduna: { lat: "10.5200", lon: "7.4382" },
  Kano: { lat: "12.0022", lon: "8.5920" },
  Katsina: { lat: "12.9855", lon: "7.6172" },
  Kebbi: { lat: "12.4500", lon: "4.1994" },
  Kogi: { lat: "7.8000", lon: "6.7333" },
  Kwara: { lat: "8.5000", lon: "4.5500" },
  Lagos: { lat: "6.5244", lon: "3.3792" },
  Nasarawa: { lat: "8.5000", lon: "8.2000" },
  Niger: { lat: "9.6000", lon: "6.5500" },
  Ogun: { lat: "7.1557", lon: "3.3451" },
  Ondo: { lat: "7.2500", lon: "5.2000" },
  Osun: { lat: "7.7667", lon: "4.5667" },
  Oyo: { lat: "7.8500", lon: "3.9333" },
  Plateau: { lat: "9.9167", lon: "8.9000" },
  Rivers: { lat: "4.8156", lon: "7.0498" },
  Sokoto: { lat: "13.0667", lon: "5.2333" },
  Taraba: { lat: "8.8833", lon: "11.3667" },
  Yobe: { lat: "11.7500", lon: "11.9667" },
  Zamfara: { lat: "12.1667", lon: "6.6667" }
};

const AddressComponentsUser = ({
  updateData,
  handleInputChange,
  isLoading,
  address,
  setAddress,
  debouncedAddress,
  setDebouncedAddress,
  setValueAddress,
  valueAdress,
  latLon,
  setLatLon,
  originalData
}: {
  updateData: Partial<{
    name: string;
    storeName: string;
    email: string;
    phone_number: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
  }>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  debouncedAddress: string;
  setDebouncedAddress: React.Dispatch<React.SetStateAction<string>>;
  setValueAddress: React.Dispatch<React.SetStateAction<string>>;
  valueAdress: string;
  latLon: {
    lat: string;
    lon: string;
  };
  setLatLon: React.Dispatch<
    React.SetStateAction<{
      lat: string;
      lon: string;
    }>
  >;
  originalData: {
    name: string;
    storeName: string;
    email: string;
    phone_number: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    lat: string;
    lon: string;
  };
}) => {
  const { data: locations, isLoading: gettingLocations } = useFetchLocations(
    debouncedAddress ?? ""
  );

  console.log("LAT LON", latLon);

  // Fallback function to get coordinates from state and country
  const getFallbackCoordinates = React.useCallback(
    (state: string, country: string) => {
      if (country === "Nigeria" && state && nigerianStateCoordinates[state]) {
        return nigerianStateCoordinates[state];
      }
      // Default to Nigeria center if no specific state found
      return { lat: "9.0765", lon: "7.3986" }; // Abuja coordinates
    },
    []
  );

  // Effect to set fallback coordinates when state/country changes and no address is selected
  useEffect(() => {
    if (!valueAdress && updateData.state && updateData.country) {
      const fallbackCoords = getFallbackCoordinates(
        updateData.state,
        updateData.country
      );
      setLatLon(fallbackCoords);
    }
  }, [
    updateData.state,
    updateData.country,
    valueAdress,
    setLatLon,
    getFallbackCoordinates
  ]);

  console.log(address, "LOCATIONS ");

  const handleSelectLocation = (location: Location) => {
    console.log(location);

    setValueAddress(location.display_name);
    setAddress("");
    setDebouncedAddress("");

    setLatLon({
      lat: location.lat,
      lon: location.lon
    });

    // Note: this will log the **old state**, not the just-updated one
    console.log("LAT LON FUNCTION", latLon);
  };

  // Handle clearing selected location
  const handleClearLocation = () => {
    setValueAddress("");
    setAddress("");
    setDebouncedAddress("");
    // Set fallback coordinates when clearing
    if (updateData.state && updateData.country) {
      const fallbackCoords = getFallbackCoordinates(
        updateData.state,
        updateData.country
      );
      setLatLon(fallbackCoords);
    }
  };
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border border-blue-100 dark:border-gray-600">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Address Information
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Provide your location details for accurate delivery services.
        </p>
      </div>

      {/* Country and State Section */}
      <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          {isLoading ? (
            <Skeleton />
          ) : (
            <>
              <label
                htmlFor="country"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <MapPin className="h-4 w-4 text-gray-500" />
                Country
              </label>

              <Select
                onValueChange={(e) =>
                  handleInputChange({
                    target: { name: "country", value: e }
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                value={updateData.country || originalData.country || ""}
              >
                <SelectTrigger className="h-12 px-4 focus:ring-2 focus:ring-blue-500 border border-gray-300 focus:border-blue-500 block w-full text-sm rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border border-gray-200 dark:border-gray-700">
                  {COUNTRIES.map((country) => (
                    <SelectItem
                      key={country}
                      value={country}
                      className="hover:bg-blue-50 dark:hover:bg-gray-700"
                    >
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
        </div>
        <div className="space-y-2">
          {isLoading ? (
            <Skeleton />
          ) : (
            <>
              <label
                htmlFor="state"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <MapPin className="h-4 w-4 text-gray-500" />
                State
              </label>

              <Select
                onValueChange={(e) =>
                  handleInputChange({
                    target: { name: "state", value: e }
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                value={updateData.state || originalData.state || ""}
              >
                <SelectTrigger className="h-12 px-4 focus:ring-2 focus:ring-blue-500 border border-gray-300 focus:border-blue-500 block w-full text-sm rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500">
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border border-gray-200 dark:border-gray-700 max-h-60">
                  {NIGERIAN_STATES.map((state) => (
                    <SelectItem
                      key={state}
                      value={state}
                      className="hover:bg-blue-50 dark:hover:bg-gray-700"
                    >
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
        </div>
      </div>

      {/* Address Search Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Address Search
          </label>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <Skeleton />
          ) : (
            <>
              {/* Input shows if no location selected */}
              {!valueAdress ? (
                <div className="relative">
                  <InputComponent
                    label=""
                    placeholder="Enter your address to search..."
                    name="address"
                    value={
                      address || originalData.address || updateData.address
                    }
                    onChange={(e) => {
                      setAddress(e.target.value);
                    }}
                    className="h-12 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 border border-gray-300 focus:border-blue-500 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              ) : (
                <div className="flex items-center justify-between border border-green-200 dark:border-green-700 rounded-lg px-4 py-3 bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">
                      {valueAdress}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearLocation}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full transition-colors duration-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Suggestions */}
              {gettingLocations ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                    Searching for locations...
                  </div>
                  <div className="space-y-2">
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                  </div>
                </div>
              ) : (
                <>
                  {locations?.length > 0 && debouncedAddress && (
                    <div className="relative">
                      <div className="absolute z-10 mt-2 w-full max-h-60 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
                        {locations.map((location: Location) => (
                          <div
                            key={location.display_name}
                            className="cursor-pointer px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors duration-200"
                            onClick={() => handleSelectLocation(location)}
                          >
                            <div className="flex items-start gap-3">
                              <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {location.display_name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {location.address.city},{" "}
                                  {location.address.state}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {locations?.length === 0 &&
                    debouncedAddress &&
                    !gettingLocations && (
                      <div className="flex items-center gap-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        <span className="text-sm text-yellow-800 dark:text-yellow-200">
                          We could not find that location. Using state
                          coordinates as fallback.
                        </span>
                      </div>
                    )}
                </>
              )}
            </>
          )}
        </div>
      </div>
      {/* Additional Address Details Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Additional Details
          </h4>
        </div>

        <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            {isLoading ? (
              <Skeleton />
            ) : (
              <InputComponent
                label="Zip Code"
                name="zip_code"
                value={updateData.zip_code || originalData.zip_code || ""}
                onChange={handleInputChange}
                className="h-12 px-4 focus:ring-2 focus:ring-blue-500 border border-gray-300 focus:border-blue-500 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
              />
            )}
          </div>

          <div className="space-y-2">
            {isLoading ? (
              <Skeleton />
            ) : (
              <InputComponent
                label="City"
                name="city"
                value={updateData.city || originalData.city || ""}
                onChange={handleInputChange}
                className="h-12 px-4 focus:ring-2 focus:ring-blue-500 border border-gray-300 focus:border-blue-500 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
              />
            )}
          </div>
        </div>
      </div>

      {/* Location Status Indicator */}
      {latLon?.lat && latLon?.lon && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
              <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Location Coordinates Set
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Lat: {latLon.lat}, Lon: {latLon.lon}
                {valueAdress
                  ? " (from address search)"
                  : " (from state fallback)"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressComponentsUser;
