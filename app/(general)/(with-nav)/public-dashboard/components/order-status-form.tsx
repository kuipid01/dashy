/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState } from "react";
import { Mail, Lock, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OrderStatusFormProps {
  onOrderFound: (orderData: any) => void;
}

export function OrderStatusForm({ onOrderFound }: OrderStatusFormProps) {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (email && pin) {
        // Mock order data
        const mockOrderData = {
          id: "ORD-2024-001",
          status: "In Transit",
          email: email,
          items: [
            {
              id: 1,
              name: "Wireless Headphones Pro",
              quantity: 1,
              price: 299.99,
              image: "/wireless-headphones.png"
            },
            {
              id: 2,
              name: "USB-C Cable",
              quantity: 2,
              price: 19.99,
              image: "/usb-cable.png"
            }
          ],
          total: 339.97,
          orderDate: "2024-01-15",
          estimatedDelivery: "2024-01-20",
          trackingNumber: "TRK123456789",
          store: {
            name: "TechHub Electronics",
            logo: "/electronics-store-logo.png",
            rating: 4.8,
            responseTime: "< 2 hours"
          },
          shippingAddress: {
            name: "John Doe",
            street: "123 Main Street",
            city: "New York",
            state: "NY",
            zip: "10001"
          },
          timeline: [
            { status: "Order Placed", date: "2024-01-15", completed: true },
            { status: "Processing", date: "2024-01-16", completed: true },
            { status: "Shipped", date: "2024-01-17", completed: true },
            { status: "In Transit", date: "2024-01-18", completed: true },
            { status: "Delivered", date: "2024-01-20", completed: false }
          ]
        };
        onOrderFound(mockOrderData);
      } else {
        setError("Please enter both email and PIN");
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="p-6">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
            <Search className="w-8 h-8 _text-primary" />
          </div>
          <h3 className="text-lg font-medium">Track Your Order</h3>
          <p className="text-sm text-muted-foreground text-pretty">
            Enter your email and the PIN you received when placing your order
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative ">
              <Mail className="absolute left-3 z-10 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pin">Purchase ID</Label>
            <div className="relative">
              <Lock className="absolute z-10 left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black" />
              <Input
                id="pin"
                type="text"
                placeholder="Enter your Purchase ID"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                className="pl-10 font-mono tracking-wider"
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Find My Order
              </>
            )}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Don&apos;t have your PIN? Check your order confirmation email
          </p>
        </div>
      </div>
    </div>
  );
}
