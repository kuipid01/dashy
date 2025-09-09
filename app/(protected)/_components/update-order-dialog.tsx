"use client";

import { Order } from "@/constants/types";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { CheckCircle, Clock, Package, Truck, XCircle } from "lucide-react";
import { useUpdateOrder } from "@/app/(handlers)/orders";

interface UpdateOrderDialogProps {
  order: Order;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusOptions = [
  { value: "pending", label: "Pending", icon: Clock, color: "text-yellow-600" },
  {
    value: "processing",
    label: "Processing",
    icon: Package,
    color: "text-blue-600"
  },
  { value: "shipped", label: "Shipped", icon: Truck, color: "text-purple-600" },
  {
    value: "delivered",
    label: "Delivered",
    icon: CheckCircle,
    color: "text-green-600"
  },
  {
    value: "cancelled",
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-600"
  }
];

export default function UpdateOrderDialog({
  order,
  isOpen,
  onOpenChange
}: UpdateOrderDialogProps) {
  const { mutateAsync: updateOrder, isPending: updatingOrder } =
    useUpdateOrder();
  const [estimatedArrivalDate, setEstimatedArrivalDate] = useState<string>(
    order.arrival_date
      ? new Date(order.arrival_date).toISOString().split("T")[0]
      : ""
  );
  const [selectedStatus, setSelectedStatus] = useState<string>(order.status);

  const quickDateOptions = [
    { label: "In 3 days", days: 3 },
    { label: "In 5 days", days: 5 },
    { label: "In 1 week", days: 7 },
    { label: "In 2 weeks", days: 14 },
    { label: "In 1 month", days: 30 }
  ];

  const handleQuickDateSelect = (days: number) => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    setEstimatedArrivalDate(futureDate.toISOString().split("T")[0]);
  };

  const handleUpdateOrder = async () => {
    await updateOrder({
      id: order.id,
      data: {
        arrival_date: estimatedArrivalDate
          ? new Date(estimatedArrivalDate)
          : undefined,
        status:
          selectedStatus === "draft"
            ? "pending"
            : (selectedStatus as
                | "pending"
                | "processing"
                | "shipped"
                | "delivered"
                | "cancelled"
                | undefined)
      }
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[500px] max-w-[90vw] flex flex-col gap-4 p-6">
        <DialogTitle className="text-xl font-semibold">
          Update Order #{order?.id}
        </DialogTitle>

        <div className="space-y-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Estimated Arrival Date
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {quickDateOptions.map((option) => (
                <Button
                  key={option.days}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickDateSelect(option.days)}
                  className="text-xs"
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-gray-600">
                Or select a custom date:
              </Label>
              <Input
                type="date"
                value={estimatedArrivalDate}
                onChange={(e) => setEstimatedArrivalDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Order Status</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full text-black">
                <SelectValue
                  className="text-black"
                  placeholder="Select status"
                />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => {
                  const IconComponent = status.icon;
                  return (
                    <SelectItem key={status.value} value={status.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent className={`h-4 w-4 ${status.color}`} />
                        <span>{status.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updatingOrder}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateOrder}
            disabled={
              updatingOrder ||
              (!estimatedArrivalDate && selectedStatus === order.status)
            }
            className="bg-black text-white hover:bg-gray-800"
          >
            {updatingOrder ? "Updating..." : "Update Order"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
