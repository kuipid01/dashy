/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { toast } from "sonner";

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
  const [selectedStatus, setSelectedStatus] = useState<string>("");

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
    if (order.status === "dispute" || order.status === "delivered") {
      toast.error(
        "You cannot update this order, the order status is already completed, cancelled or disputed"
      );
      return;
    }

    const payload: Record<string, any> = {};

    if (estimatedArrivalDate) {
      payload.arrival_date = estimatedArrivalDate;
    }

    if (selectedStatus !== "" || selectedStatus !== order.status) {
      payload.status = selectedStatus === "draft" ? "pending" : selectedStatus;
    }

    await updateOrder({
      id: order.id,
      data: payload
    });

    onOpenChange(false);
  };
  const cannotUpdateOrder =
    order.status === "dispute" || order.status === "delivered";
  console.log(cannotUpdateOrder, "CANNOT UPDATE ORDER ");
  console.log(updatingOrder, "UPDATING ORDER ");
  console.log(estimatedArrivalDate, "ESTIMATED ARRIVAL DATE ");
  console.log(selectedStatus, "SELECTED STATUS ");
  console.log(order.status, "ORDER STATUS ");
  console.log(cannotUpdateOrder, "CANNOT UPDATE ORDER ");

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
              <SelectTrigger className="w-full  !text-black">
                <SelectValue className=" bg-emerald-500" placeholder="Status" />
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
            className="bg-gray-800  text-white hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateOrder}
            disabled={
              cannotUpdateOrder ||
              updatingOrder ||
              (!estimatedArrivalDate && selectedStatus === order.status)
            }
            className="bg-black disabled:bg-gray-800 text-white hover:bg-gray-800"
          >
            {updatingOrder ? "Updating..." : "Update Order"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
