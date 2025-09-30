"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Search, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PublicDashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API call to verify order
    setTimeout(() => {
      if (email && pin) {
        // In a real app, you would verify the email and PIN with your backend
        // For now, we'll generate a mock order ID and navigate to it
        const orderId = `ORD-${pin}`;
        router.push(
          `/public-dashboard/${orderId}?email=${encodeURIComponent(email)}`
        );
      } else {
        setError("Please enter both email and Purchase ID");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen _bg-gradient-to-br py-10 from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md mt-15 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Package className="w-8 h-8 text-dark" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Track Your Order
          </h1>
          <p className="text-muted-foreground">
            Enter your details to view your order status and tracking
            information
          </p>
        </div>

        {/* Form Card */}
        <Card className="shadow-xl border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Order Lookup
            </CardTitle>
            <CardDescription>
              Enter the email and Purchase ID from your order confirmation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
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
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="pin"
                    type="text"
                    placeholder="Enter your Purchase ID"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="pl-10 font-mono tracking-wider"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Find this in your order confirmation email
                </p>
              </div>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Track Order
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Need help? Contact our support team
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <a
              href="mailto:support@example.com"
              className="hover:text-primary transition-colors"
            >
              Email Support
            </a>
            <span>•</span>
            <a
              href="tel:+1234567890"
              className="hover:text-primary transition-colors"
            >
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
