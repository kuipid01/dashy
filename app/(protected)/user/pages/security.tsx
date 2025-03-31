import React, { useState } from "react";
import { InputComponent } from "@/app/(protected)/_components/input-component";
import { Switch } from "@/components/ui/switch";


const Security = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <div className="pb-20 pt-10">
      <div className="p-5 border rounded-md border-gray-300 max-w-full md:max-w-[80%] mx-auto px-10 flex flex-col">
        {/* Password Change Section */}
        <h2 className="text-xl font-semibold mb-5">Password Settings</h2>
        <div className="grid w-full grid-cols-1 gap-5">
          <InputComponent placeholder="Current Password" label="Current Password" name="currentPassword" />
          <InputComponent placeholder="New Password" label="New Password" name="newPassword" />
          <InputComponent placeholder="Confirm Password" label="Confirm Password" name="confirmPassword" />
        </div>

        {/* Two-Factor Authentication */}
        <h2 className="text-xl font-semibold mt-10 mb-5">Two-Factor Authentication</h2>
        <div className="flex items-center justify-between">
          <span>Enable Two-Factor Authentication</span>
          <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
        </div>

        {/* Security Questions */}
        <h2 className="text-xl font-semibold mt-10 mb-5">Security Question</h2>
        <select className="border h-[45px] mb-3 p-2 rounded-md w-full">
          <option>What was the name of your first pet?</option>
          <option>What is your mother&apos;s maiden name?</option>
          <option>What was your first car?</option>
        </select>
        <InputComponent placeholder="Answer" label="Your Answer" name="securityAnswer" />

        {/* Backup Codes */}
        <h2 className="text-xl font-semibold mt-10 mb-5">Backup Codes</h2>
        <button className="bg-black text-white py-2 px-5 rounded-md mb-3">Generate Backup Codes</button>

        {/* Active Sessions */}
        <h2 className="text-xl font-semibold mt-10 mb-5">Active Sessions</h2>
        <div className="border p-3 rounded-md w-fit">
          <p>Device: Windows - Chrome</p>
          <p>Location: New York, USA</p>
          <button className="text-red-500">Log Out</button>
        </div>

        {/* Trusted Devices */}
        <h2 className="text-xl font-semibold mt-10 mb-5">Trusted Devices</h2>
        <div className="border p-3 rounded-md w-fit">
          <p>Device: MacBook Pro</p>
          <p>Last Used: 3 Days Ago</p>
          <button className="text-red-500">Remove</button>
        </div>

        {/* Account Recovery */}
        <h2 className="text-xl font-semibold mt-10 mb-5">Account Recovery</h2>
        <div className=" grid grid-cols-2 gap-5">
          <InputComponent placeholder="Recovery Email" label="Recovery Email" name="recoveryEmail" />
          <InputComponent placeholder="Recovery Phone Number" label="Recovery Phone" name="recoveryPhone" />
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-end mt-5">
          <button className="bg-black text-white py-2 px-8 rounded-md">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default Security;
