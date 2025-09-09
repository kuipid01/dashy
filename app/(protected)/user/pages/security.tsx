/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import { InputComponent } from "@/app/(protected)/_components/input-component";
import { useFetchUser } from "@/app/(handlers)/auth-handlers/auth";
import {
  useGetUserSecurity,
  useUpdateUserSecurity
} from "@/app/(handlers)/user/user";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const Security = () => {
  const { data: userSecurity, isLoading: fetchingSecutrity } =
    useGetUserSecurity();
  const [backUpCodes, setBackUpCodes] = useState<string[]>([]);
  const [securityData, setSecurityData] = useState<Record<string, any>>({});
  const { user: userData, isLoading: isUserLoading } = useFetchUser();
  const { mutateAsync, isPending } = useUpdateUserSecurity();

  console.log(userSecurity);
  // Populate form fields with fetched data on initial load
  useEffect(() => {
    if (userSecurity) {
      setSecurityData({
        recovery_email: userSecurity.security_settings.recovery_email || "",
        backup_phone: userSecurity.security_settings.backup_phone || "",
        security_question:
          userSecurity.security_settings.security_question || "",
        security_answer: userSecurity.security_settings.security_answer || ""
      });
      // Optionally, set the backup codes here if they exist
      setBackUpCodes(userSecurity.security_settings.backup_codes || []);
    }
  }, [userSecurity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (securityData.backup_phone) {
      const isValid = validatePhoneNumber(securityData.backup_phone);
      if (!isValid) {
        return;
      }
    }
    if (securityData.recovery_email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(securityData.recovery_email)) {
        toast.error("Invalid recovery email format.");
        return;
      }
    }

    await mutateAsync(securityData);
    // Reset form after successful submission
    setSecurityData({});
    toast.success("Security settings updated successfully.");
  };

  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast.error("Invalid phone number format.");
      return false;
    }
    return true;
  };

  const handleGenerateBackupCodes = (): string[] => {
    const codes = Array.from({ length: 10 }, () =>
      Math.random().toString(36).substring(2, 15)
    );
    setBackUpCodes(codes);
    setSecurityData({ ...securityData, backup_codes: codes });
    return codes;
  };

  const displayBackupCodes =
    backUpCodes.length > 0
      ? backUpCodes
      : userSecurity?.security_settings.backup_codes || [];

  const shouldShowPasswordSettings =
    !userData?.Provider || userData.Provider === "";
  console.log(userData?.Provider);
  return (
    <div className="pb-20 pt-10">
      <form onSubmit={handleSubmit}>
        <div className="p-5 bgblur border rounded-l _border-gray-300 max-w-full md:max-w-[80%] mx-auto px-10 flex flex-col">
          {/* Password Change Section */}
          <h2 className="text-xl font-semibold mb-5">Password Settings</h2>
          {shouldShowPasswordSettings && (
            <div className="grid w-full grid-cols-1 gap-5">
              <InputComponent
                placeholder="Current Password"
                label="Current Password"
                name="currentPassword"
                type="password"
                onChange={(e) =>
                  setSecurityData({
                    ...securityData,
                    currentPassword: e.target.value
                  })
                }
              />
              <InputComponent
                placeholder="New Password"
                label="New Password"
                name="newPassword"
                type="password"
                onChange={(e) =>
                  setSecurityData({
                    ...securityData,
                    newPassword: e.target.value
                  })
                }
              />
              <InputComponent
                placeholder="Confirm Password"
                label="Confirm Password"
                name="confirmPassword"
                type="password"
              />
            </div>
          )}

          {/* Security Questions */}
          <h2 className="text-xl font-semibold mt-10 mb-5">
            Security Question
          </h2>
          <select
            onChange={(e) =>
              setSecurityData({
                ...securityData,
                security_question: e.target.value
              })
            }
            className="border border-gray-500 h-[45px] mb-3 p-2 rounded-md w-full"
            value={securityData.security_question || ""}
          >
            <option value="" disabled>
              Select a question
            </option>
            <option value="What was the name of your first pet?">
              What was the name of your first pet?
            </option>
            <option value="What is your mother's maiden name?">
              What is your mother&apos;s maiden name?
            </option>
            <option value="What was your first car?">
              What was your first car?
            </option>
          </select>
          <InputComponent
            placeholder="Answer"
            label="Your Answer"
            name="securityAnswer"
            value={securityData.security_answer || ""}
            onChange={(e) =>
              setSecurityData({
                ...securityData,
                security_answer: e.target.value
              })
            }
          />

          {/* Account Recovery */}
          <h2 className="text-xl font-semibold mt-10 mb-5">Account Recovery</h2>
          <div className="grid grid-cols-2 gap-5">
            <InputComponent
              placeholder="Recovery Email"
              label="Recovery Email"
              name="recoveryEmail"
              value={securityData.recovery_email || ""}
              onChange={(e) =>
                setSecurityData({
                  ...securityData,
                  recovery_email: e.target.value
                })
              }
            />
            <InputComponent
              placeholder="Recovery Phone Number"
              label="Recovery Phone"
              name="recoveryPhone"
              value={securityData.backup_phone || ""}
              onChange={(e) =>
                setSecurityData({
                  ...securityData,
                  backup_phone: e.target.value
                })
              }
            />
          </div>

          {/* Save Changes Button */}
          <div className="flex justify-end mt-5">
            <button
              disabled={isPending || Object.keys(securityData).length === 0}
              type="submit"
              className="bg-black cursor-pointer disabled:bg-black/70 text-white py-2 px-8 rounded-md"
            >
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Security;
