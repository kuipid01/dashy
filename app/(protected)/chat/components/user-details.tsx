/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/constants/types";
import { Mail, Phone, X } from "lucide-react";
import React from "react";

const UserDetailsChat = ({
  user,
  setShowDetails,
}: {
  user: User;
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  console.log(
    user?.Name?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  );
  return (
    <div
      className=" absolute z-[100000] flex flex-col gap-5
     p-10 bg-white top-0 h-full  right-0 w-[45%] border-l border-gray-200 shadow-2xl shadow-gray-200 "
    >
      <div className="flex items-center justify-between">
        <X
          size={30}
          className=" cursor-pointer"
          onClick={() => {
            setShowDetails(false);
          }}
        />
        <p className=" text-2xl ">User Details</p>
      </div>
      <Avatar className="size-[150px] mx-auto mt-3 flex">
        <AvatarImage
          className=" "
          src={user.avatar ?? user.avatar_url ?? user.AvatarURL ?? ""}
        />
        <AvatarFallback className="bg-black  size-[300px] text-white font-semibold">
          {user?.Name?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-4 mt-7">
        <div className=" flex items-center justify-between">
          <Phone />
          <div className="flex flex-col">
            <p>
              {
                //@ts-expect-error
                user.Store.phone ?? "Not Available"
              }
            </p>
          </div>
        </div>
        <div className=" flex items-center justify-between">
          <Mail />
          <div className="flex flex-col">
            <p>{user.Email ?? "Not Available"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsChat;
