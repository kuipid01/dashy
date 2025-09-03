/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/app/(handlers)/base";

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  addressDescription?: string;
}

interface AddressSelectionProps {
  email: string;
  onAddressSelected: (address: Address) => void;
  onNewAddressAdded: (address: Address) => void;
}

export const AddressSelection = ({
  email,
  onAddressSelected,
  onNewAddressAdded
}: AddressSelectionProps) => {
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [hasLoadedAddresses, setHasLoadedAddresses] = useState(false);

  // New address form state
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    addressDescription: ""
  });

  const loadUserAddresses = useCallback(async () => {
    if (hasLoadedAddresses) return;

    setIsLoading(true);
    try {
      const response = await api.get(
        `/users/addresses?email=${encodeURIComponent(email)}`
      );
      if (response.status === 200) {
        const data = response.data;
        setAddresses(data.addresses || []);
      }
    } catch (error) {
      console.error("Failed to load addresses:", error);
    } finally {
      setIsLoading(false);
      setHasLoadedAddresses(true);
    }
  }, [email, hasLoadedAddresses]);

  const handleAddNewAddress = async () => {
    if (
      !newAddress.street ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.postalCode ||
      !newAddress.country
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post(`/addresses/public?email=${email}`, {
        ...newAddress
      });

      const data = response.data;
      const addedAddress = data.address;

      setAddresses((prev: Address[]) => [...prev, addedAddress]);
      setSelectedAddressId(addedAddress.id);
      onNewAddressAdded(addedAddress);
      setShowNewAddressForm(false);
      toast.success("Address added successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to add address. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    const selectedAddress = addresses.find(
      (addr: Address) => addr.id === addressId
    );
    if (selectedAddress) {
      onAddressSelected(selectedAddress);
    }
  };

  // Load addresses when component mounts
  useEffect(() => {
    loadUserAddresses();
  }, [loadUserAddresses]);
  return (
    <div className="space-y-6">
      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">Loading your addresses...</p>
        </div>
      )}

      {/* Existing Addresses */}
      {!isLoading && addresses.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Choose from your saved addresses
          </h3>
          <RadioGroup
            value={selectedAddressId}
            onValueChange={handleAddressSelect}
            className="space-y-3"
          >
            {addresses.map((address: Address) => (
              <div
                key={address.id}
                className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <RadioGroupItem value={address.id} id={address.id} />
                <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                  <div className="space-y-1">
                    <p className="font-medium">{address.street}</p>
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className="text-sm text-gray-600">{address.country}</p>
                    {address.addressDescription && (
                      <p className="text-sm text-gray-500">
                        {address.addressDescription}
                      </p>
                    )}
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* No Addresses Message */}
      {!isLoading && addresses.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500 mb-4">No saved addresses found</p>
        </div>
      )}

      {/* Add New Address Button */}
      {!showNewAddressForm && (
        <Button
          variant="outline"
          onClick={() => setShowNewAddressForm(true)}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Address
        </Button>
      )}

      {/* New Address Form */}
      {showNewAddressForm && (
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-700">
            Add New Address
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                placeholder="123 Main St"
                value={newAddress.street}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, street: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Lagos"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="Lagos"
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  placeholder="100001"
                  value={newAddress.postalCode}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      postalCode: e.target.value
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  placeholder="Nigeria"
                  value={newAddress.country}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      country: e.target.value
                    })
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="addressDescription">
                Address Description (Optional)
              </Label>
              <Input
                id="addressDescription"
                placeholder="e.g., Near the blue gate"
                value={newAddress.addressDescription}
                onChange={(e) =>
                  setNewAddress({
                    ...newAddress,
                    addressDescription: e.target.value
                  })
                }
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleAddNewAddress}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Adding..." : "Add Address"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowNewAddressForm(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
