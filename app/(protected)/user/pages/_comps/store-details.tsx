"use client";
import { ImageUp, Pencil } from "lucide-react";
import React from "react";
import { InputComponent } from "@/app/(protected)/_components/input-component";

const StoreDetails = () => {
  return (
    <div className="pb-20  pt-10 ">
      <div className="p-3 md:p-5 bg-white border rounded-md border-gray-300 max-w-full md:max-w-[80%] mx-auto md:px-10 flex flex-col">
        <label
          className=" rounded-full relative grid place-items-center  size-50 bg-gray-300"
          htmlFor="profile-picture"
        >
          <div className=" flex flex-col items-center">
            <p className=" font-medium text-xs">Store Logo</p>
            <ImageUp size={50} />
          </div>

          <div className=" rounded-full absolute top-[40px] right-1 size-10 bg-black/80 grid place-items-center">
            <Pencil className=" absolute text-white " />
          </div>
        </label>
        <input
          className="hidden"
          type="file"
          name="profile-picture"
          id="profile-picture"
        />

        <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-5 md:gap-10">
          <div>
            <InputComponent
              placeholder="Store Name"
              label="Store Name"
              name="store name"
            />
          </div>
          <div>
            <InputComponent
              placeholder="Store Location"
              label="Store Location"
              name="storeName"
            />
          </div>
        </div>
        <div className="grid w-full mt-10 grid-cols-1 md:grid-cols-2 gap-5 md:gap-10">
          <div>
            <InputComponent
              placeholder="Phone Number"
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
