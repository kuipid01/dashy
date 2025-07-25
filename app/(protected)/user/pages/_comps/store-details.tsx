/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { ImageUp, Loader2, Pencil } from "lucide-react";
import React, { useEffect, useState } from "react";
import { InputComponent } from "@/app/(protected)/_components/input-component";
import {
  useFetchUser,
  useFetchUserStore,
} from "@/app/(handlers)/auth-handlers/auth";
import { useUpdateStore } from "@/app/(handlers)/store/store";
import { useUpdateUser } from "@/app/(handlers)/user/user";
import { useUploadImage } from "@/app/(handlers)/product/product";
import { toast } from "sonner";
import { Store } from "@/types/store";
import Image from "next/image";

const StoreDetails = () => {
  const { store: userStore, isLoading: isStoreLoading } = useFetchUserStore();

  const store: Store = userStore?.store || {};
  const { user: userData, isLoading: isUserLoading } = useFetchUser();
  const { mutateAsync: updateStore, isPending: updatingStore } =
    useUpdateStore();
  const { mutateAsync: updateUser, isPending: updatingUser } = useUpdateUser();
  const { upload, isPending: uploadingImage } = useUploadImage();
  console.log(userStore);
  const isLoading = isUserLoading || isStoreLoading;

  const [storeLogo, setStoreLogo] = useState<File | null>(null);
  const [storeHeaderImage, setStoreHeaderImage] = useState<File | null>(null);
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
          store_logo: res.urls[0],
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
          cover_image: res.urls[0],
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
    <div className="pb-20  pt-10 ">
      <div className="p-3 md:p-5 bgblur border rounded-md border-gray-300 max-w-full md:max-w-[80%] mx-auto md:px-10 flex flex-col">
        <div className="flex items-center gap-10">
          <label
            className=" cursor-pointer rounded-full relative grid place-items-center  size-50 bg-gray-300"
            htmlFor="store-logo"
          >
            {store.store_logo ? (
              <Image
                src={store.store_logo}
                width={200}
                height={200}
                alt="Store Header"
                className="size-[200px] object-cover rounded-lg"
              />
            ) : (
              <>
                <div className=" flex flex-col items-center">
                  <p className=" font-medium text-xs">Store Logo</p>
                  <ImageUp size={50} />
                </div>

                <div className=" rounded-full absolute top-[40px] right-1 size-10 bg-black/80 grid place-items-center">
                  <Pencil className=" absolute text-white " />
                </div>
              </>
            )}
          </label>
          <label
            className="cursor-pointer rounded-lg h-[200px] relative flex items-center flex-col justify-center flex-1 bg-black/80"
            htmlFor="store-header-image"
          >
            {store.cover_image ? (
              <Image
                src={store.cover_image}
                width={200}
                height={200}
                alt="Store Header"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : uploadingImage ? (
              <Loader2 />
            ) : (
              <div className=" flex flex-col items-center">
                <p className=" font-medium text-white text-xs">Store Header</p>
                <ImageUp color="white" size={50} />
              </div>
            )}
            <div className=" rounded-full absolute top-[20px] right-10 size-10 bg-black/60 grid place-items-center">
              <Pencil className=" absolute text-white " />
            </div>
          </label>
        </div>

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

        <div className="grid w-full mt-5 grid-cols-1 md:grid-cols-2 gap-5 md:gap-10">
          <div>
            <InputComponent
              placeholder={store.name || "Store Name"}
              label="Store Name"
              name="store name"
              disabled
            />
          </div>
          <div>
            <InputComponent
              placeholder={userStore?.store?.address || "Store Location "}
              disabled
              label="Store Location"
              name="storeName"
            />
          </div>
        </div>
        <div className="grid w-full mt-10 grid-cols-1 md:grid-cols-2 gap-5 md:gap-10">
          <div>
            <InputComponent
              disabled
              placeholder={userStore?.store?.phone_number || "Phone Number"}
              label="Phone Number"
              name="phoneNumber"
            />
          </div>
        </div>

        <div className="flex justify-end mt-5 md:mt-10">
          <button className="bg-black text-white py-2 px-8 rounded-md">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreDetails;
