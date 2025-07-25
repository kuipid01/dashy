/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Pencil } from "lucide-react";
import React, { useEffect, useState } from "react";
import { InputComponent } from "@/app/(protected)/_components/input-component";
import { toast } from "sonner";
import Image from "next/image";
import { useUploadImage } from "@/app/(handlers)/product/product";
import {
  useFetchUser,
  useFetchUserStore,
} from "@/app/(handlers)/auth-handlers/auth";
import { useUpdateStore } from "@/app/(handlers)/store/store";
import Btn from "../../_components/btn";
import { useUpdateUser } from "@/app/(handlers)/user/user";

const PersonalInformation = () => {
  const { store: userStore, isLoading: isStoreLoading } = useFetchUserStore();
  const { user: userData, isLoading: isUserLoading } = useFetchUser();
  const { mutateAsync: updateStore, isPending: updatingStore } =
    useUpdateStore();
  const { mutateAsync: updateUser, isPending: updatingUser } = useUpdateUser();
  const { upload, isPending: uploadingImage } = useUploadImage();

  const isLoading = isUserLoading || isStoreLoading;

  const [file, setFile] = useState<File | null>(null);
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
    }>
  >({});

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setFile(file);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUpdateData((prev) => ({ ...prev, [name]: value }));

    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast.error("Invalid email format");
    }

    if (name === "phone_number" && !/^\+?[1-9]\d{1,14}$/.test(value)) {
      toast.error("Invalid phone number format");
    }
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
          avatar_url: res.urls[0],
        });

        setFile(null);
        toast.success("Profile updated");
      };

      handleUpload();
    }
  }, [file, upload, updateUser, userData]);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      validateFields();

      // Update user name if provided
      if (updateData.name) {
        await updateUser({
          ...userData,
          avatar_url:
            userData?.AvatarURL || userData?.avatar || userData?.avatar,
          Name: updateData.name,
        });
      }

      // Prepare store update payload
      const { name, ...rest } = updateData;
      console.log(name);
      const payload = {
        ...userStore?.store,
        ...rest,

        ...(updateData.storeName ? { name: updateData.storeName } : {}),
      };

      await updateStore(payload);
      await updateStore(payload);
      toast.success("Store updated successfully");
      setUpdateData({});
    } catch (error: any) {
      toast.error(error.message || "Validation failed");
    }
  };

  const validateFields = () => {
    if (
      updateData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateData.email)
    )
      throw new Error("Invalid email");

    if (
      updateData.phone_number &&
      !/^\+?[1-9]\d{1,14}$/.test(updateData.phone_number)
    )
      throw new Error("Invalid phone number");
  };

  const Skeleton = () => (
    <div className="h-[52px] w-full bg-gray-200 animate-pulse rounded-md" />
  );

  return (
    <div className="pb-20 pt-10">
      <form onSubmit={handleSubmit}>
        <div className="p-3 md:p-5 bgblur border rounded-lg _border-gray-300 max-w-full md:max-w-[80%] mx-auto md:px-10 flex flex-col">
          {/* PROFILE PICTURE */}
          <label
            htmlFor="profile-picture"
            className="rounded-full cursor-pointer relative grid place-items-center size-[200px] bg-gray-300 self-center mb-10"
          >
            {isLoading ? (
              <div className="rounded-full bg-gray-200 animate-pulse size-[200px]" />
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
                  className="rounded-full object-cover size-[200px]"
                  width={200}
                  height={200}
                />
                <div className="rounded-full absolute top-[160px] right-1 size-10 bg-black/80 grid place-items-center">
                  <Pencil className="text-white" />
                </div>
              </>
            )}
          </label>
          <input
            onChange={handleFileChange}
            className="hidden"
            type="file"
            accept="image/*"
            name="profile-picture"
            id="profile-picture"
          />

          {/* FORM FIELDS */}
          <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-5 md:gap-10">
            <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-5 md:gap-10">
              {isLoading ? (
                <>
                  {[1, 2, 4, 5].map((i) => (
                    <Skeleton key={i} />
                  ))}
                </>
              ) : (
                <InputComponent
                  placeholder={userData?.Name || "Full Name"}
                  label="Name"
                  name="name"
                  value={updateData.name || userData?.Name || ""}
                  onChange={handleInputChange}
                />
              )}
            </div>
            <div>
              {isLoading ? (
                <Skeleton />
              ) : (
                <InputComponent
                  placeholder={userStore?.store?.name || "Store Name"}
                  label="Store Name"
                  name="storeName"
                  value={updateData.storeName || userStore?.store?.name || ""}
                  onChange={handleInputChange}
                />
              )}
            </div>
          </div>

          <div className="grid w-full mt-10 grid-cols-1 md:grid-cols-2 gap-5 md:gap-10">
            <div>
              {isLoading ? (
                <Skeleton />
              ) : (
                <InputComponent
                  placeholder={userStore?.store?.email || "Email"}
                  label="Email"
                  name="email"
                  value={updateData.email || userStore?.store?.email || ""}
                  onChange={handleInputChange}
                />
              )}
            </div>
            <div>
              {isLoading ? (
                <Skeleton />
              ) : (
                <InputComponent
                  placeholder={userStore?.store?.phone_number || "Phone Number"}
                  label="Phone Number"
                  name="phone_number"
                  value={
                    updateData.phone_number ||
                    userStore?.store?.phone_number ||
                    ""
                  }
                  onChange={handleInputChange}
                />
              )}
            </div>
          </div>

          <div className="grid w-full mt-10 grid-cols-1 md:grid-cols-2 gap-5 md:gap-10">
            <div>
              {isLoading ? (
                <Skeleton />
              ) : (
                <InputComponent
                  placeholder={userStore?.store?.address || "Address"}
                  label="Address"
                  name="address"
                  value={updateData.address || userStore?.store?.address || ""}
                  onChange={handleInputChange}
                />
              )}
            </div>
            <div>
              {isLoading ? (
                <Skeleton />
              ) : (
                <InputComponent
                  placeholder={userStore?.store?.city || "City"}
                  label="City"
                  name="city"
                  value={updateData.city || userStore?.store?.city || ""}
                  onChange={handleInputChange}
                />
              )}
            </div>
          </div>

          <div className="grid w-full mt-10 grid-cols-1 md:grid-cols-2 gap-5 md:gap-10">
            <div>
              {isLoading ? (
                <Skeleton />
              ) : (
                <InputComponent
                  placeholder={userStore?.store?.state || "State"}
                  label="State"
                  name="state"
                  value={updateData.state || userStore?.store?.state || ""}
                  onChange={handleInputChange}
                />
              )}
            </div>
            <div>
              {isLoading ? (
                <Skeleton />
              ) : (
                <InputComponent
                  placeholder={userStore?.store?.zip_code || "Zip Code"}
                  label="Zip Code"
                  name="zip_code"
                  value={
                    updateData.zip_code || userStore?.store?.zip_code || ""
                  }
                  onChange={handleInputChange}
                />
              )}
            </div>
          </div>

          <div className="grid w-full mt-10 grid-cols-1 md:grid-cols-2 gap-5 md:gap-10">
            <div>
              {isLoading ? (
                <Skeleton />
              ) : (
                <InputComponent
                  placeholder={userStore?.store?.country || "Country"}
                  label="Country"
                  name="country"
                  value={updateData.country || userStore?.store?.country || ""}
                  onChange={handleInputChange}
                />
              )}
            </div>
          </div>

          <div className="flex justify-end mt-5 md:mt-10">
            <Btn
              disabled={Object.keys(updateData).length === 0 && !file}
              isPending={updatingStore || updatingUser}
              className="bg-black disabled:bg-black/50 disabled:cursor-none text-white py-2 px-8 rounded-md"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default PersonalInformation;
