/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import {
  ImageUp,
  Loader2,
  Pencil,
  CheckCircle2,
  AlertTriangle,
  Store,
  MapPin,
  Phone,
  Mail,
  Globe,
  Palette,
  Camera,
  Shield,
  Eye,
  EyeOff
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { InputComponent } from "@/app/(protected)/_components/input-component";
import {
  useFetchUser,
  useFetchUserStore
} from "@/app/(handlers)/auth-handlers/auth";
import { useUpdateStore } from "@/app/(handlers)/store/store";
import { useUpdateUser } from "@/app/(handlers)/user/user";
import { useUploadImage } from "@/app/(handlers)/product/product";
import { toast } from "sonner";
import { Store as StoreType } from "@/types/store";
import Image from "next/image";
import clsx from "clsx";

const StoreDetails = () => {
  const { store: userStore, isLoading: isStoreLoading } = useFetchUserStore();

  const store: StoreType = userStore?.store || {};
  const { user: userData, isLoading: isUserLoading } = useFetchUser();
  const { mutateAsync: updateStore, isPending: updatingStore } =
    useUpdateStore();
  const { mutateAsync: updateUser, isPending: updatingUser } = useUpdateUser();
  const { upload, isPending: uploadingImage } = useUploadImage();
  console.log(userStore);
  const isLoading = isUserLoading || isStoreLoading;

  const [storeLogo, setStoreLogo] = useState<File | null>(null);
  const [storeHeaderImage, setStoreHeaderImage] = useState<File | null>(null);

  // Store activation status checker
  const getStoreActivationStatus = () => {
    const requirements = {
      storeName: {
        valid: !!store.name && store.name.length >= 4,
        label: "Store Name",
        icon: Store
      },
      storeLogo: {
        valid: !!store.store_logo,
        label: "Store Logo",
        icon: Camera
      },
      coverImage: {
        valid: !!store.cover_image,
        label: "Cover Image",
        icon: ImageUp
      },
      location: {
        valid: !!(store.address && store.state && store.country),
        label: "Location Details",
        icon: MapPin
      },
      contact: {
        valid: !!(store.email && store.phone_number),
        label: "Contact Information",
        icon: Phone
      },
      description: {
        valid: !!store.description && store.description.length > 10,
        label: "Store Description",
        icon: Globe
      }
    };

    const validCount = Object.values(requirements).filter(
      (req) => req.valid
    ).length;
    const totalCount = Object.keys(requirements).length;
    const isFullyActivated = validCount === totalCount && store.is_active;

    return { requirements, validCount, totalCount, isFullyActivated };
  };

  const storeStatus = getStoreActivationStatus();
  useEffect(() => {
    if (storeLogo) {
      const handleUpload = async () => {
        const validTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!validTypes.includes(storeLogo.type)) {
          toast.error("Invalid file type");
          return;
        }
        if (storeLogo.size > 5 * 1024 * 1024) {
          toast.error("File too large (max 5MB)");
          return;
        }

        const res = await upload([storeLogo]);
        await updateStore({
          ...userData,
          store_logo: res.urls[0]
        });

        setStoreLogo(null);
        toast.success("Store logo updated successfully  ");
      };

      handleUpload();
    }
  }, [storeLogo, upload, updateStore, userData]);
  useEffect(() => {
    if (storeHeaderImage) {
      const handleUpload = async () => {
        const validTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!validTypes.includes(storeHeaderImage.type)) {
          toast.error("Invalid file type");
          return;
        }
        if (storeHeaderImage.size > 5 * 1024 * 1024) {
          toast.error("File too large (max 5MB)");
          return;
        }

        const res = await upload([storeHeaderImage]);
        await updateStore({
          ...userData,
          cover_image: res.urls[0]
        });

        setStoreHeaderImage(null);
        toast.success("Store header image updated successfully  ");
      };

      handleUpload();
    }
  }, [storeHeaderImage, upload, updateStore, userData]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files, id } = event.target;
    if (files && files.length > 0) {
      const file = files[0];
      if (id === "store-logo") {
        setStoreLogo(file);
      } else if (id === "store-header-image") {
        setStoreHeaderImage(file);
      }
    }
  };

  return (
    <div className="pb-20 pt-10 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Store Details
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your store branding and information
          </p>
        </div>

        {/* Store Activation Status Badge */}
        <div className="mb-8">
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
                    ? "Store Active & Ready"
                    : "Store Setup Required"}
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
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Store Branding Section */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 px-6 py-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Palette className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Store Branding
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Store Logo */}
              <div className="lg:col-span-1">
                <label
                  className="cursor-pointer group relative block w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 transition-colors duration-200"
                  htmlFor="store-logo"
                >
                  {store.store_logo ? (
                    <div className="relative w-full h-full rounded-xl overflow-hidden">
                      <Image
                        src={store.store_logo}
                        fill
                        alt="Store Logo"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-2">
                            <Pencil className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                      <Camera className="h-12 w-12 mb-2" />
                      <p className="text-sm font-medium">Store Logo</p>
                      <p className="text-xs text-center">Click to upload</p>
                    </div>
                  )}
                </label>
              </div>

              {/* Cover Image */}
              <div className="lg:col-span-2">
                <label
                  className="cursor-pointer group relative block w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 transition-colors duration-200"
                  htmlFor="store-header-image"
                >
                  {store.cover_image ? (
                    <div className="relative w-full h-full rounded-xl overflow-hidden">
                      <Image
                        src={store.cover_image}
                        fill
                        alt="Store Cover"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-2">
                            <Pencil className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : uploadingImage ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                      <ImageUp className="h-12 w-12 mb-2" />
                      <p className="text-sm font-medium">Cover Image</p>
                      <p className="text-xs text-center">Click to upload</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Store Information Section */}
          <div className="px-6 py-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Store className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Store Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <InputComponent
                  placeholder={store.name || "Store Name"}
                  label="Store Name"
                  name="store name"
                  disabled
                  className="h-12 px-4 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <InputComponent
                  placeholder={store.address || "Store Location"}
                  disabled
                  label="Store Location"
                  name="storeName"
                  className="h-12 px-4 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="px-6 py-8 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Contact Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <InputComponent
                  disabled
                  placeholder={store.phone_number || "Phone Number"}
                  label="Phone Number"
                  name="phoneNumber"
                  className="h-12 px-4 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <InputComponent
                  disabled
                  placeholder={store.email || "Email Address"}
                  label="Email Address"
                  name="email"
                  className="h-12 px-4 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Store Status Section */}
          <div className="px-6 py-8 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 border-t border-gray-200 dark:border-gray-600">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Store Status
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {store.is_active
                      ? "Store is currently active"
                      : "Store is inactive"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {store.is_active ? (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-full">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm font-medium">Active</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                    <EyeOff className="h-4 w-4" />
                    <span className="text-sm font-medium">Inactive</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hidden file inputs */}
        <input
          onChange={handleFileChange}
          className="hidden"
          type="file"
          name="store-logo"
          id="store-logo"
          accept="image/*"
        />

        <input
          onChange={handleFileChange}
          className="hidden"
          type="file"
          name="store-header-image"
          id="store-header-image"
          accept="image/*"
        />
      </div>
    </div>
  );
};

export default StoreDetails;
