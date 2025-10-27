/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { SetStateAction, Dispatch, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { useFetchUser } from "@/app/(handlers)/auth-handlers/auth";
import Skeleton from "@/app/(general)/_compoenents/skeleton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ShippingInfoProps {
  firstName: string;
  lastName: string;
  email: string;
  setFirstName: Dispatch<SetStateAction<string>>;
  setLastName: Dispatch<SetStateAction<string>>;
  setEmail: Dispatch<SetStateAction<string>>;
  handleEmailChange: (newEmail: string) => void;
  setPhone: Dispatch<SetStateAction<string>>;
  phone: string;
}

const ShippingInformation = ({
  firstName,
  lastName,
  setFirstName,
  setLastName,
  handleEmailChange,
  email,
  setEmail,
  phone,
  setPhone
}: ShippingInfoProps) => {
  const { user, isLoading: isUserLoading } = useFetchUser();

  useEffect(() => {
    if (user && typeof user.Name === "string") {
      const [firstName, lastName] = user.Name.split(" ");
      if (firstName) {
        setFirstName(firstName);
      }
      if (lastName) {
        setLastName(lastName);
      }
      if (user.Email) {
        setEmail(user.Email);
      }
    }
  }, [user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Shipping Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 border-b pb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">
              Contact Details
            </h3>
          </div>

          {isUserLoading ? (
            // Skeleton loading state
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </>
          ) : user ? (
            // User is logged in, display non-editable details
            <>
              <div className="px-5 py-2 text-white text-sm bg-new-secondary">
                We found an account with the logged in user, details will be
                used.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>First Name</Label>
                  <div className="bg-gray-100 p-3 rounded-md font-medium text-gray-800">
                    {firstName}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Last Name</Label>
                  <div className="bg-gray-100 p-3 rounded-md font-medium text-gray-800">
                    {lastName}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Email</Label>
                <div className="bg-gray-100 p-3 rounded-md font-medium text-gray-800">
                  {email}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  required
                  id="phone"
                  placeholder="+234 801 234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </>
          ) : (
            // User is not logged in, display editable form
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    required
                    id="firstName"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    required
                    id="lastName"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  required
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  required
                  id="phone"
                  placeholder="+234 801 234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </>
          )}

          {/* Alternative Contact (Optional) section remains the same */}
          <div className="space-y-2 mt-4">
            <h4 className="text-sm font-medium text-gray-500">
              Alternative Contact (Optional)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="subContactPhone">Alternative Phone</Label>
                <Input id="subContactPhone" placeholder="+234 801 987 6543" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="subContactEmail">Alternative Email</Label>
                <Input
                  id="subContactEmail"
                  type="email"
                  placeholder="alt.contact@example.com"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShippingInformation;
