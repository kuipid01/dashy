/* eslint-disable @typescript-eslint/no-explicit-any */
import Skeleton from "@/app/(general)/_compoenents/skeleton";
import { InputComponent } from "@/app/(protected)/_components/input-component";
import { Button } from "@/components/ui/button";
import { Location } from "@/constants/types";
import { AlertCircle, CheckCircle2, MapPin, Search, X } from "lucide-react";
import React, { SetStateAction, Dispatch } from "react";
interface AbsProps {
  valueAdress: string;
  gettingLocations: boolean;
  handleUseMyLocationNow: () => void;
  isLoadingLocation: boolean;
  address: string;
  setAddress: Dispatch<SetStateAction<string>>;
  handleClearLocation: () => void;
  handleSelectLocation: (location: Location) => void;
  debouncedAddress: string;
  locations: any;
}
const AbstractedLocationManager = ({
  valueAdress,
  gettingLocations,
  handleUseMyLocationNow,
  isLoadingLocation,
  address,
  setAddress,
  handleClearLocation,
  debouncedAddress,
  handleSelectLocation,
  locations
}: AbsProps) => {
  return (
    <div>
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-3">
        <Button
          onClick={handleUseMyLocationNow}
          disabled={isLoadingLocation}
          variant="secondary"
        >
          {isLoadingLocation
            ? "Getting your location..."
            : "Use my location now"}
        </Button>
        <div className="text-xs text-muted-foreground">or search below</div>
      </div>
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-gray-500" />
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Address Search
        </label>
      </div>

      <>
        {/* Input shows if no location selected */}
        {!valueAdress ? (
          <div className="relative">
            <InputComponent
              label=""
              placeholder="Enter your address to search..."
              name="address"
              value={address}
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
          <div className="space-y-2 mt-3">
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
              <div className="relative mt-1">
                <div className="absolute z-10 mt-2 w-full max-h-60 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
                  {locations.map((location: Location) => (
                    <div
                      key={location.display_name}
                      className="cursor-pointer px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors duration-200"
                      onClick={() => {
                        console.log("WE CLICKED THE THE ADD LOCATION BTN");

                        handleSelectLocation(location);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {location.display_name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {location.address.city}, {location.address.state}
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
                    We could not find that location. Using state coordinates as
                    fallback.
                  </span>
                </div>
              )}
          </>
        )}
      </>
    </div>
  );
};

export default AbstractedLocationManager;
