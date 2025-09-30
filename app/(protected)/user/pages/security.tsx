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
import {
  Loader2,
  Shield,
  Lock,
  Key,
  Phone,
  Mail,
  HelpCircle,
  Eye,
  EyeOff,
  Copy,
  CheckCircle2,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";

const Security = () => {
  const { data: userSecurity, isLoading: fetchingSecutrity } =
    useGetUserSecurity();
  const [backUpCodes, setBackUpCodes] = useState<string[]>([]);
  const [securityData, setSecurityData] = useState<Record<string, any>>({});
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>(
    {}
  );
  const [copiedCodes, setCopiedCodes] = useState<boolean>(false);
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
      console.log(userSecurity);
      setBackUpCodes(
        userSecurity.security_settings.BackupCodes.split(",") || []
      );
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

    try {
      await mutateAsync(securityData);
      // Reset form after successful submission
      setSecurityData({});
      toast.success("Security settings updated successfully.");
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.error ?? "An error occured");
    }
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
    setSecurityData({ ...securityData, backup_codes: codes.toString() });
    return codes;
  };

  const displayBackupCodes =
    backUpCodes.length > 0
      ? backUpCodes
      : userSecurity?.security_settings.backup_codes || [];

  const shouldShowPasswordSettings =
    !userData?.Provider || userData.Provider === "";
  console.log(userData?.Provider);

  // Security status checker
  const getSecurityStatus = () => {
    const requirements = {
      recoveryEmail: {
        valid:
          !!securityData.recovery_email &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(securityData.recovery_email),
        label: "Recovery Email",
        icon: Mail
      },
      backupPhone: {
        valid:
          !!securityData.backup_phone &&
          /^\+?[1-9]\d{1,14}$/.test(securityData.backup_phone),
        label: "Backup Phone",
        icon: Phone
      },
      securityQuestion: {
        valid:
          !!securityData.security_question && !!securityData.security_answer,
        label: "Security Question",
        icon: HelpCircle
      },
      backupCodes: {
        valid: backUpCodes.length > 0,
        label: "Backup Codes",
        icon: Key
      }
    };

    const validCount = Object.values(requirements).filter(
      (req) => req.valid
    ).length;
    const totalCount = Object.keys(requirements).length;
    const isFullySecured = validCount === totalCount;

    return { requirements, validCount, totalCount, isFullySecured };
  };

  const securityStatus = getSecurityStatus();

  // Helper functions
  const togglePasswordVisibility = (field: string) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const copyBackupCodes = async () => {
    if (displayBackupCodes.length > 0) {
      await navigator.clipboard.writeText(displayBackupCodes.join("\n"));
      setCopiedCodes(true);
      toast.success("Backup codes copied to clipboard");
      setTimeout(() => setCopiedCodes(false), 2000);
    }
  };
  return (
    <div className="pb-20 pt-10 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Security Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your account security and recovery options
          </p>
        </div>

        {/* Security Status Badge */}
        <div className="mb-8">
          <div
            className={clsx(
              "rounded-xl p-6 border-2 transition-all duration-300",
              securityStatus.isFullySecured
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
                : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700"
            )}
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className={clsx(
                  "p-3 rounded-full",
                  securityStatus.isFullySecured
                    ? "bg-green-100 dark:bg-green-800"
                    : "bg-yellow-100 dark:bg-yellow-800"
                )}
              >
                {securityStatus.isFullySecured ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                )}
              </div>
              <div>
                <h3
                  className={clsx(
                    "text-lg font-semibold",
                    securityStatus.isFullySecured
                      ? "text-green-900 dark:text-green-100"
                      : "text-yellow-900 dark:text-yellow-100"
                  )}
                >
                  {securityStatus.isFullySecured
                    ? "Account Fully Secured"
                    : "Security Setup Required"}
                </h3>
                <p
                  className={clsx(
                    "text-sm",
                    securityStatus.isFullySecured
                      ? "text-green-700 dark:text-green-300"
                      : "text-yellow-700 dark:text-yellow-300"
                  )}
                >
                  {securityStatus.validCount} of {securityStatus.totalCount}{" "}
                  security measures completed
                </p>
              </div>
            </div>

            {!securityStatus.isFullySecured && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Complete these security measures to protect your account:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {Object.entries(securityStatus.requirements).map(
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

        <form onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Password Settings Section */}
            {shouldShowPasswordSettings && (
              <div className="px-6 py-8 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Password Settings
                  </h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2 relative">
                    <InputComponent
                      placeholder="Enter your current password"
                      label="Current Password"
                      name="currentPassword"
                      type={showPasswords.currentPassword ? "text" : "password"}
                      onChange={(e) =>
                        setSecurityData({
                          ...securityData,
                          currentPassword: e.target.value
                        })
                      }
                      className="h-12 px-4 pr-12 focus:ring-2 focus:ring-blue-500 border border-gray-300 focus:border-blue-500 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        togglePasswordVisibility("currentPassword")
                      }
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPasswords.currentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <div className="space-y-2 relative">
                    <InputComponent
                      placeholder="Enter your new password"
                      label="New Password"
                      name="newPassword"
                      type={showPasswords.newPassword ? "text" : "password"}
                      onChange={(e) =>
                        setSecurityData({
                          ...securityData,
                          newPassword: e.target.value
                        })
                      }
                      className="h-12 px-4 pr-12 focus:ring-2 focus:ring-blue-500 border border-gray-300 focus:border-blue-500 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("newPassword")}
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPasswords.newPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <div className="space-y-2 relative">
                    <InputComponent
                      placeholder="Confirm your new password"
                      label="Confirm Password"
                      name="confirmPassword"
                      type={showPasswords.confirmPassword ? "text" : "password"}
                      className="h-12 px-4 pr-12 focus:ring-2 focus:ring-blue-500 border border-gray-300 focus:border-blue-500 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        togglePasswordVisibility("confirmPassword")
                      }
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPasswords.confirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Question Section */}
            <div className="px-6 py-8 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <HelpCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Security Question
                </h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Security Question
                  </label>
                  <select
                    onChange={(e) =>
                      setSecurityData({
                        ...securityData,
                        security_question: e.target.value
                      })
                    }
                    className="h-12 px-4 focus:ring-2 focus:ring-purple-500 border border-gray-300 focus:border-purple-500 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 w-full"
                    value={securityData.security_question || ""}
                  >
                    <option value="" disabled>
                      Select a security question
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
                </div>

                <div className="space-y-2">
                  <InputComponent
                    placeholder="Enter your answer"
                    label="Your Answer"
                    name="securityAnswer"
                    value={securityData.security_answer || ""}
                    onChange={(e) =>
                      setSecurityData({
                        ...securityData,
                        security_answer: e.target.value
                      })
                    }
                    className="h-12 px-4 focus:ring-2 focus:ring-purple-500 border border-gray-300 focus:border-purple-500 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:ring-purple-500 dark:focus:border-purple-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Account Recovery Section */}
            <div className="px-6 py-8 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Account Recovery
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <InputComponent
                    placeholder="Enter recovery email"
                    label="Recovery Email"
                    name="recoveryEmail"
                    value={securityData.recovery_email || ""}
                    onChange={(e) =>
                      setSecurityData({
                        ...securityData,
                        recovery_email: e.target.value
                      })
                    }
                    className="h-12 px-4 focus:ring-2 focus:ring-green-500 border border-gray-300 focus:border-green-500 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:ring-green-500 dark:focus:border-green-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                  />
                </div>

                <div className="space-y-2">
                  <InputComponent
                    placeholder="Enter recovery phone number"
                    label="Recovery Phone"
                    name="recoveryPhone"
                    value={securityData.backup_phone || ""}
                    onChange={(e) =>
                      setSecurityData({
                        ...securityData,
                        backup_phone: e.target.value
                      })
                    }
                    className="h-12 px-4 focus:ring-2 focus:ring-green-500 border border-gray-300 focus:border-green-500 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:ring-green-500 dark:focus:border-green-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Backup Codes Section */}
            <div className="px-6 py-8 bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <Key className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Backup Codes
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Generate backup codes for account recovery
                  </p>
                  <button
                    type="button"
                    onClick={handleGenerateBackupCodes}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Generate Codes
                  </button>
                </div>

                {displayBackupCodes.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Your backup codes (save these securely):
                      </p>
                      <button
                        type="button"
                        onClick={copyBackupCodes}
                        className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
                      >
                        {copiedCodes ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        {copiedCodes ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                      {displayBackupCodes.map((code, index) => (
                        <div
                          key={index}
                          className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono text-center"
                        >
                          {code}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Save Changes Section */}
            <div className="px-6 py-8 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 border-t border-gray-200 dark:border-gray-600">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Save Security Settings
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {securityStatus.isFullySecured
                        ? "All security measures are in place"
                        : `${
                            securityStatus.totalCount -
                            securityStatus.validCount
                          } security measures remaining`}
                    </p>
                  </div>
                </div>

                <button
                  disabled={isPending || Object.keys(securityData).length === 0}
                  type="submit"
                  className={clsx(
                    "px-8 py-3 rounded-lg cursor-pointer font-medium transition-all duration-200 shadow-lg flex items-center gap-2",
                    securityStatus.isFullySecured
                      ? "bg-green-600 hover:bg-green-700 text-white disabled:bg-green-400"
                      : "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400"
                  )}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Shield className="h-4 w-4" />
                  )}
                  {isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Security;
