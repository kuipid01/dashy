/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderStatusForm } from "./order-status-form";
import { OrderDetails } from "./order-details";

interface OrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OrderStatusModal({ isOpen, onClose }: OrderStatusModalProps) {
  const [currentStep, setCurrentStep] = useState<"form" | "details">("form");
  const [orderData, setOrderData] = useState<any>(null);

  const handleOrderFound = (data: any) => {
    setOrderData(data);
    setCurrentStep("details");
  };

  const handleBack = () => {
    setCurrentStep("form");
    setOrderData(null);
  };

  const handleClose = () => {
    setCurrentStep("form");
    setOrderData(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        // onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full _max-w-4xl mx-4 max-h-[90vh] overflow-hidden animate-slide-in-up">
        <div className="bg-primary border border-border rounded-lg shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-semibold">
              {currentStep === "form" ? "Check Order Status" : "Order Details"}
            </h2>
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button> */}
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            {currentStep === "form" ? (
              <OrderStatusForm onOrderFound={handleOrderFound} />
            ) : (
              <OrderDetails orderData={orderData} onBack={handleBack} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
