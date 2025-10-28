/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Pencil,
  CheckCircle2,
  AlertTriangle,
  Store,
  MapPin,
  User,
  Mail,
  Phone,
  Building2,
  Shield
} from "lucide-react";
import { useStoreActivation } from "@/lib/hooks/use-store-activation";
import React, { useEffect, useState, useRef } from "react";
import { InputComponent } from "@/app/(protected)/_components/input-component";
import { toast } from "sonner";
import Image from "next/image";
import { useUploadImage } from "@/app/(handlers)/product/product";
import {
  useFetchUser,
  useFetchUserStore
} from "@/app/(handlers)/auth-handlers/auth";
import {
  useUpdateStore,
  useCheckStoreName
} from "@/app/(handlers)/store/store";
import Btn from "../../_components/btn";
import { useUpdateUser } from "@/app/(handlers)/user/user";
import clsx from "clsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  getStates,
  useFetchLocations,
  useGetNGStores
} from "@/app/(handlers)/externals/ng-data/ng-data";
import AddressComponentsUser from "./_comps/address-components-user";

const PersonalInformation = () => {
  const [address, setAddress] = useState("");
  const [valueAddress, setValueAddress] = useState("");
  const [latLon, setLatLon] = useState<{ lat: string; lon: string }>({
    lat: "",
    lon: ""
  });

  const [debouncedAddress, setDebouncedAddress] = useState("");

  const { mutateAsync: checkName, isPending: checking } = useCheckStoreName();
  const { store: userStore, isLoading: isStoreLoading } = useFetchUserStore();
  const { user: userData, isLoading: isUserLoading } = useFetchUser();
  const { mutateAsync: updateStore, isPending: updatingStore } =
    useUpdateStore();
  const { mutateAsync: updateUser, isPending: updatingUser } = useUpdateUser();
  const { upload, isPending: uploadingImage } = useUploadImage();
  const [nameValid, setNameValid] = useState(false);
  const [debouncedName, setdebouncedName] = useState("");
  const initialStoreNameRef = useRef(""); // Keep track of the initial store name

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDebouncedAddress(address);
    }, 1000);

    return () => {
      clearTimeout(timeOut);
    };
  }, [address]);

  const isLoading = isUserLoading || isStoreLoading;

  const [file, setFile] = useState<File | null>(null);
  // Separate state for tracking changes vs original backend data
  const [originalData, setOriginalData] = useState<{
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
  }>({
    name: "",
    storeName: "",
    email: "",
    phone_number: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
    lat: "",
    lon: ""
  });

  const [updateData, setUpdateData] = useState<
    Partial<{
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
    }>
  >({});

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setFile(file);
  };

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setdebouncedName(updateData.storeName ?? "");
    }, 500);

    return () => {
      clearTimeout(timeOut);
    };
  }, [updateData.storeName]);

  // FIX: This useEffect now only runs if the store name has actually changed from its initial value.
  useEffect(() => {
    // Exit early if the debounced name is the same as the initial name
    if (debouncedName === initialStoreNameRef.current) {
      setNameValid(true); // Treat the initial name as valid
      return;
    }

    // Perform checks only on a new store name
    if (!debouncedName) {
      setNameValid(false);
      return;
    }

    if (debouncedName.length < 4) {
      setNameValid(false);
      return;
    }

    if (/\s/.test(debouncedName)) {
      setNameValid(false);
      toast.error("Store name cannot contain spaces");
      return;
    }

    const check = async () => {
      try {
        const res: any = await checkName(debouncedName);
        console.log(res, "ress");
        setNameValid(true);
      } catch (error: any) {
        setNameValid(false);
        toast.error(error?.response?.data?.error || "Validation failed");
      }
    };

    check();
  }, [debouncedName, checkName]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUpdateData((prev) => ({ ...prev, [name]: value }));
  };

  // Function to detect if there are any changes
  const hasChanges = () => {
    const currentValues = {
      name: updateData.name || originalData.name,
      storeName: updateData.storeName || originalData.storeName,
      email: updateData.email || originalData.email,
      phone_number: updateData.phone_number || originalData.phone_number,
      address: valueAddress || originalData.address,
      city: updateData.city || originalData.city,
      state: updateData.state || originalData.state,
      zip_code: updateData.zip_code || originalData.zip_code,
      country: updateData.country || originalData.country
    };

    return Object.keys(currentValues).some(
      (key) =>
        currentValues[key as keyof typeof currentValues] !==
        originalData[key as keyof typeof originalData]
    );
  };

  useEffect(() => {
    if (file) {
      const handleUpload = async () => {
        const validTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!validTypes.includes(file.type)) {
          toast.error("Invalid file type");
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error("File too large (max 5MB)");
          return;
        }

        const res = await upload([file]);
        await updateUser({
          ...userData,
          avatar_url: res.urls[0]
        });

        setFile(null);
        toast.success("Profile updated");
      };

      handleUpload();
    }
  }, [file, upload, updateUser, userData]);

  // helper: get only changed fields
  function getChangedFields<T extends object>(
    original: T,
    current: T
  ): Partial<T> {
    const changes: Partial<T> = {};
    for (const key in current) {
      if (current[key] !== original[key]) {
        changes[key] = current[key];
      }
    }
    return changes;
  }

  console.log(hasChanges());
  const handleSubmit = async () => {
    console.log("here");
    try {
      validateFields();

      // Build current values from updateData + originalData
      const currentValues = {
        ...originalData,
        ...updateData
      };

      // --- User updates ---
      const userChanges = getChangedFields(originalData, currentValues);

      if (Object.keys(userChanges).length > 0 && updateData.name) {
        await updateUser({
          ...userChanges,
          avatar_url: userData?.AvatarURL || userData?.avatar || ""
        });
        toast.success("User updated successfully");
      }

      // --- Store updates ---
      const storeChanges = getChangedFields(originalData, currentValues);

      // If address changed and we have coords, add them
      console.log(
        currentValues.address,
        "ADDRESS FROM STATE",
        originalData.address,
        "DB ADDRESS"
      );
      console.log(latLon.lat, latLon.lon);
      if (latLon.lat && latLon.lon) {
        storeChanges.lat = latLon.lat;
        storeChanges.lon = latLon.lon;
      }
      if (valueAddress) {
        storeChanges.address = valueAddress;
      }

      if (Object.keys(storeChanges).length > 0) {
        const { name, ...rest } = storeChanges;
        console.log(storeChanges, "changes been passed");
        await updateStore(rest);
        toast.success("Store updated successfully");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.error || "Validation failed");
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast.error("Invalid email format");
    }
    if (name === "phone_number" && !/^\+?[1-9]\d{1,14}$/.test(value)) {
      toast.error("Invalid phone number format");
    }
  };

  const validateFields = () => {
    if (
      updateData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateData.email)
    )
      throw new Error("Invalid email");

    // if (
    //   updateData.phone_number &&
    //   /^(?:\+?[1-9]\d{1,14}|0\d{9,14})$/.test(updateData.phone_number)
    // ) {
    //   toast.error("Invald Phone Number");

    //   throw new Error("Invalid phone number");
    // }
  };

  // FIX: Capture the initial store name and set nameValid to true
  useEffect(() => {
    if (userData || userStore) {
      const initialStoreName = userStore?.store?.name || "";
      const initialData = {
        name: userData?.Name || "",
        storeName: initialStoreName,
        email: userData?.Email || "",
        phone_number: userStore?.store?.phone_number || "",
        address: userStore?.store?.address || "",
        city: userStore?.store?.city || "",
        state: userStore?.store?.state || "",
        zip_code: userStore?.store?.zip_code || "",
        country: userStore?.store?.country || "",
        lon: userStore?.store?.lon || "",
        lat: userStore?.store?.lat || ""
      };

      console.log(userStore?.store, "store");
      setOriginalData(initialData);
      setUpdateData({}); // Reset update data to empty object
      setValueAddress(initialData.address); // Set the address value
      initialStoreNameRef.current = initialStoreName;
      setNameValid(true); // The initial name is always considered valid
    }
  }, [userData, userStore]);

  console.log(originalData, "original data");
  const Skeleton = () => (
    <div className="space-y-2">
      <div className="h-4 w-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 animate-pulse rounded-md" />
      <div className="h-12 w-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 animate-pulse rounded-lg" />
    </div>
  );

  const EnhancedSkeleton = () => (
    <div className="space-y-2">
      <div className="h-4 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-600 dark:via-gray-700 dark:to-gray-600 rounded-md bg-[length:200%_100%] animate-[shimmer_2s_infinite]" />
      <div className="h-12 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-600 dark:via-gray-700 dark:to-gray-600 rounded-lg bg-[length:200%_100%] animate-[shimmer_2s_infinite]" />
    </div>
  );

  // Store activation status using the new utility
  const storeData = {
    storeName: updateData.storeName || originalData.storeName,
    state: updateData.state || originalData.state,
    country: updateData.country || originalData.country,
    email: updateData.email || originalData.email,
    phone_number: updateData.phone_number || originalData.phone_number,
    lat: originalData.lat,
    lon: originalData.lon
  };

  const storeStatus = useStoreActivation(storeData, nameValid);

  return (
    <div className="pb-20 pt-10 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="sm:text-3xl text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Personal Information
          </h1>
          <p className="sm:text-base text-sm text-gray-600 dark:text-gray-300">
            Manage your profile and store details
          </p>
        </div>

        {/* Store Activation Status Badge */}
        <div className="mb-8">
          {isLoading ? (
            <div className="rounded-xl p-6 border-2 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-gray-200 dark:bg-gray-600 animate-pulse">
                  <div className="h-6 w-6 bg-gray-300 dark:bg-gray-500 rounded-full animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-600 dark:via-gray-700 dark:to-gray-600 rounded-md bg-[length:200%_100%] animate-[shimmer_2s_infinite]" />
                  <div className="h-4 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-600 dark:via-gray-700 dark:to-gray-600 rounded-md bg-[length:200%_100%] animate-[shimmer_2s_infinite]" />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="h-4 w-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-600 dark:via-gray-700 dark:to-gray-600 rounded-md bg-[length:200%_100%] animate-[shimmer_2s_infinite] mb-3" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-4 w-4 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse" />
                      <div className="h-4 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-600 dark:via-gray-700 dark:to-gray-600 rounded-md bg-[length:200%_100%] animate-[shimmer_2s_infinite]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div
              className={clsx(
                "rounded-xl p-6 border-2 transition-all duration-300",
                storeStatus.isFullyActivated
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
                  : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700"
              )}
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={clsx(
                    "p-3 rounded-full",
                    storeStatus.isFullyActivated
                      ? "bg-green-100 dark:bg-green-800"
                      : "bg-yellow-100 dark:bg-yellow-800"
                  )}
                >
                  {storeStatus.isFullyActivated ? (
                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  )}
                </div>
                <div>
                  <h3
                    className={clsx(
                      "text-lg font-semibold",
                      storeStatus.isFullyActivated
                        ? "text-green-900 dark:text-green-100"
                        : "text-yellow-900 dark:text-yellow-100"
                    )}
                  >
                    {storeStatus.isFullyActivated
                      ? "Store Active"
                      : "Store Active Requirements Not Fufilled"}
                  </h3>
                  <p
                    className={clsx(
                      "text-sm",
                      storeStatus.isFullyActivated
                        ? "text-green-700 dark:text-green-300"
                        : "text-yellow-700 dark:text-yellow-300"
                    )}
                  >
                    {storeStatus.validCount} of {storeStatus.totalCount}{" "}
                    requirements completed
                  </p>
                </div>
              </div>

              {!storeStatus.isFullyActivated && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Complete these requirements to activate your store:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(storeStatus.requirements).map(
                      ([key, req]) => {
                        const IconComponent = req.icon;
                        return (
                          <div key={key} className="flex items-center gap-2">
                            <IconComponent
                              className={clsx(
                                "h-4 w-4",
                                req.valid
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-gray-400 dark:text-gray-500"
                              )}
                            />
                            <span
                              className={clsx(
                                "text-sm",
                                req.valid
                                  ? "text-green-700 dark:text-green-300"
                                  : "text-gray-600 dark:text-gray-400"
                              )}
                            >
                              {req.label}
                            </span>
                            {req.valid && (
                              <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <form>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Profile Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 px-6 py-8 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <label
                    htmlFor="profile-picture"
                    className="rounded-full cursor-pointer relative grid place-items-center w-32 h-32 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                  >
                    {isLoading ? (
                      <div className="relative">
                        <div className="rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 animate-pulse w-32 h-32 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-500 animate-pulse" />
                        </div>
                        <div className="absolute inset-0 rounded-full border-2 border-gray-200 dark:border-gray-600 animate-pulse" />
                      </div>
                    ) : (
                      <>
                        <Image
                          src={
                            userData?.AvatarURL ||
                            userData?.avatar_url ||
                            userData?.avatar ||
                            "/placeholder.png"
                          }
                          alt="Profile"
                          className="rounded-full object-cover w-32 h-32"
                          width={128}
                          height={128}
                        />
                        {uploadingImage ? (
                          <div className="rounded-full absolute -bottom-2 -right-2 size-8 bg-blue-600 grid place-items-center shadow-lg">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          </div>
                        ) : (
                          <div className="rounded-full absolute -bottom-2 -right-2 size-8 bg-blue-600 hover:bg-blue-700 grid place-items-center transition-colors duration-200 shadow-lg">
                            <Pencil className="text-white h-4 w-4" />
                          </div>
                        )}
                      </>
                    )}
                  </label>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2">
                  Profile Picture
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                  {uploadingImage
                    ? "Uploading image..."
                    : "Click to upload a new profile picture"}
                </p>
              </div>
            </div>

            <input
              disabled={uploadingImage}
              onChange={handleFileChange}
              className="hidden"
              type="file"
              accept="image/*"
              name="profile-picture"
              id="profile-picture"
            />

            {/* Personal Information Section */}
            <div className="px-6 py-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Personal Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  {isLoading ? (
                    <EnhancedSkeleton />
                  ) : (
                    <InputComponent
                      label="Full Name"
                      name="name"
                      value={updateData.name || originalData.name || ""}
                      onChange={handleInputChange}
                      className="h-12 px-4 focus:ring-2 focus:ring-blue-500 border border-gray-300 focus:border-blue-500 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  {isLoading ? (
                    <EnhancedSkeleton />
                  ) : (
                    <div className="relative">
                      <InputComponent
                        label="Store Name"
                        name="storeName"
                        className={clsx(
                          "h-12 px-4 focus:ring-2 border rounded-lg transition-all duration-200",
                          nameValid
                            ? "border-green-400 focus:ring-green-500 focus:border-green-500 bg-green-50 dark:bg-green-900/20"
                            : "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50 dark:bg-red-900/20"
                        )}
                        value={
                          updateData.storeName || originalData.storeName || ""
                        }
                        onChange={handleInputChange}
                      />
                      {nameValid && (
                        <CheckCircle2 className="absolute right-3 top-9 h-5 w-5 text-green-600 dark:text-green-400" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="px-6 py-8 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Contact Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  {isLoading ? (
                    <EnhancedSkeleton />
                  ) : (
                    <InputComponent
                      label="Email Address"
                      disabled={true}
                      onBlur={handleBlur}
                      name="email"
                      value={updateData.email || originalData.email || ""}
                      onChange={handleInputChange}
                      className="h-12 px-4 focus:ring-2 focus:ring-blue-500 border border-gray-300 focus:border-blue-500 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  {isLoading ? (
                    <EnhancedSkeleton />
                  ) : (
                    <InputComponent
                      label="Phone Number"
                      name="phone_number"
                      value={
                        updateData.phone_number ||
                        originalData.phone_number ||
                        ""
                      }
                      onChange={handleInputChange}
                      className="h-12 px-4 focus:ring-2 focus:ring-blue-500 border border-gray-300 focus:border-blue-500 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            <div className="px-6 py-8 border-t border-gray-200 dark:border-gray-600">
              <AddressComponentsUser
                isLoading={isLoading}
                address={address}
                setAddress={setAddress}
                updateData={updateData}
                handleInputChange={handleInputChange}
                debouncedAddress={debouncedAddress}
                setDebouncedAddress={setDebouncedAddress}
                setValueAddress={setValueAddress}
                valueAdress={valueAddress}
                latLon={latLon}
                setLatLon={setLatLon}
                originalData={originalData}
              />
            </div>

            {/* Submit Section */}
            <div className="px-6 py-8 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 border-t border-gray-200 dark:border-gray-600">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Save Changes
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {storeStatus.isFullyActivated
                        ? "All requirements completed - Store ready for activation"
                        : `${
                            storeStatus.totalCount - storeStatus.validCount
                          } requirements remaining`}
                    </p>
                  </div>
                </div>

                <Btn
                  type="button"
                  onclick={() => {
                    handleSubmit();
                  }}
                  disabled={!hasChanges() || !nameValid}
                  isPending={updatingStore || updatingUser}
                  text={"Save Changes"}
                  className={clsx(
                    "px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg",
                    storeStatus.isFullyActivated
                      ? "bg-green-600 hover:bg-green-700 text-white disabled:bg-green-200"
                      : "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400"
                  )}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInformation;
