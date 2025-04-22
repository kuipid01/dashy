/* eslint-disable @next/next/no-img-element */
import { X } from "lucide-react";
import React from "react";

const Profile = ({
  setShowDetails
}: {
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="w-[25%] bg-white h-fit max-h-[80vh] p-6 rounded-xl shadow-lg flex flex-col gap-6 border border-gray-200">
      <div className="flex justify-between items-center">
        <h2 className="text-black font-medium">Detail group</h2>
        <X
          onClick={() => {
            setShowDetails(false);
          }}
          className="text-gray-500 cursor-pointer"
        />
      </div>
      <hr className="bg-gray-300" />
      {/* Logo & Name */}
      <div className="flex flex-col items-center">
        <div className="bg-black rounded-full w-16 h-16 flex items-center justify-center">
          <img src="/wolf-logo.png" alt="logo" className="w-10 h-10" />
        </div>
        <h3 className="mt-2 font-semibold text-lg">Wolf Pixel Family</h3>
      </div>

      {/* Description */}
      <div>
        <h4 className="text-sm font-medium text-black">Descriptions</h4>
        <p className="text-sm text-gray-700 mt-1">
          Hey lads, tough game yesterday. Let’s talk about what went wrong and
          how we can improve 😓. #GGEMYU 🔴
        </p>
      </div>
    </div>
  );
};

export default Profile;
