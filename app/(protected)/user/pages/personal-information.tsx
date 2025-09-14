/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Pencil } from "lucide-react";
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

const PersonalInformation = () => {
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

  console.log(nameValid);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUpdateData((prev) => ({ ...prev, [name]: value }));
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

  const handleSubmit = async () => {
    try {
      validateFields();

      // Update user name if provided
      if (updateData.name) {
        await updateUser({
          ...userData,
          avatar_url:
            userData?.AvatarURL || userData?.avatar || userData?.avatar,
          Name: updateData.name
        });
      }

      // Prepare store update payload
      const { name, ...rest } = updateData;

      const rawPayload = {
        ...userStore?.store,
        ...rest,
        ...(updateData.storeName ? { name: updateData.storeName } : {})
      };
      const payload = Object.fromEntries(
        Object.entries(rawPayload).filter(
          ([_, value]) => value !== null && value !== undefined && value !== ""
        )
      );

      await updateStore(payload);
      toast.success("Store updated successfully");
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.error || "Validation failed");
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

    if (
      updateData.phone_number &&
      !/^\+?[1-9]\d{1,14}$/.test(updateData.phone_number)
    )
      throw new Error("Invalid phone number");
  };

  // FIX: Capture the initial store name and set nameValid to true
  useEffect(() => {
    if (userData || userStore) {
      const initialStoreName = userStore?.store?.name || "";
      setUpdateData({
        name: userData?.Name || "",
        storeName: initialStoreName,
        email: userStore?.store?.email || "",
        phone_number: userStore?.store?.phone_number || "",
        address: userStore?.store?.address || "",
        city: userStore?.store?.city || "",
        state: userStore?.store?.state || "",
        zip_code: userStore?.store?.zip_code || "",
        country: userStore?.store?.country || ""
      });
      initialStoreNameRef.current = initialStoreName;
      setNameValid(true); // The initial name is always considered valid
    }
  }, [userData, userStore]);

  const Skeleton = () => (
    <div className="h-[52px] w-full bg-gray-200 animate-pulse rounded-md" />
  );

  return (
    <div className="pb-20 pt-10">
      <form>
        <div className="p-3 md:p-5 bgblur border rounded-lg _border-gray-300 max-w-full md:max-w-[80%] mx-auto md:px-10 flex flex-col">
          {/* PROFILE PICTURE */}
          <label
            htmlFor="profile-picture"
            className="rounded-full cursor-pointer relative grid place-items-center w-[200px] h-[200px] bg-gray-300 self-center mb-10"
          >
            {isLoading ? (
              <div className="rounded-full bg-gray-200 animate-pulse w-[200px] h-[200px]" />
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
                  className="rounded-full object-cover w-[200px] h-[200px]"
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
            disabled={uploadingImage}
            onChange={handleFileChange}
            className="hidden"
            type="file"
            accept="image/*"
            name="profile-picture"
            id="profile-picture"
          />

          {/* FORM FIELDS */}
          <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-5 md:gap-10">
            <div>
              {isLoading ? (
                <Skeleton />
              ) : (
                <InputComponent
                  label="Name"
                  name="name"
                  value={updateData.name || ""}
                  onChange={handleInputChange}
                />
              )}
            </div>
            <div>
              {isLoading ? (
                <Skeleton />
              ) : (
                <InputComponent
                  label="Store Name"
                  name="storeName"
                  className={clsx(
                    "border border-black",
                    nameValid
                      ? "!border !border-green-400 "
                      : "!border !border-red-300"
                  )}
                  value={updateData.storeName || ""}
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
                  label="Email"
                  onBlur={handleBlur}
                  name="email"
                  value={updateData.email || ""}
                  onChange={handleInputChange}
                />
              )}
            </div>
            <div>
              {isLoading ? (
                <Skeleton />
              ) : (
                <InputComponent
                  label="Phone Number"
                  name="phone_number"
                  value={updateData.phone_number || ""}
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
                  label="Address"
                  name="address"
                  value={updateData.address || ""}
                  onChange={handleInputChange}
                />
              )}
            </div>
            <div>
              {isLoading ? (
                <Skeleton />
              ) : (
                <InputComponent
                  label="City"
                  name="city"
                  value={updateData.city || ""}
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
                  label="State"
                  name="state"
                  value={updateData.state || ""}
                  onChange={handleInputChange}
                />
              )}
            </div>
            <div>
              {isLoading ? (
                <Skeleton />
              ) : (
                <InputComponent
                  label="Zip Code"
                  name="zip_code"
                  value={updateData.zip_code || ""}
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
                  label="Country"
                  name="country"
                  value={updateData.country || ""}
                  onChange={handleInputChange}
                />
              )}
            </div>
          </div>

          <div className="flex justify-end mt-5 md:mt-10">
            <Btn
              type="button"
              onclick={() => {
                console.log("here");
                handleSubmit();
              }}
              disabled={
                (Object.keys(updateData).length === 0 && !file) || !nameValid
              }
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
