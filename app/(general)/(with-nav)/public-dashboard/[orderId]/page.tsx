/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useParams } from "next/navigation";
import {
  useGetAllPurchaseOrders,
  useUpdateOrderEscrow,
} from "@/app/(handlers)/order-tracking/query";
import { Order } from "@/constants/types";
import { Store as StoreType } from "@/types/store";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Bell,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Receipt,
  FileText,
  Store,
  Send,
  Shield,
  ShieldCheck,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Star,
  Calendar,
  MapPin,
  CreditCard,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Loader2,
  X,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import Skeleton from "@/app/(general)/_compoenents/skeleton";
import {
  useUploadImage,
  useUploadImageUnprotected,
} from "@/app/(handlers)/product/product";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { DisputeResolutionResult } from "../components/dispute-resolutio-result";
import { useSubmitFeedback } from "@/app/(handlers)/feedback/queries";
import { AlertTriangle } from "lucide-react";

// Loading skeleton component
const OrderDetailsSkeleton = () => {
  return (
    <div className="flex flex-col gap-5 p-5 rounded-xl min-h-screen h-full w-full">
      <Skeleton className="h-8 w-48 mb-4" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders by Store */}
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-6 w-32" />
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4">
              <div className="space-y-3">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
              </div>
            </Card>
          ))}
        </div>

        {/* Message Box */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Card className="p-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Order status component
const OrderStatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: Clock,
          label: "Pending",
        };
      case "processing":
        return {
          color: "bg-blue-100 text-blue-800",
          icon: Package,
          label: "Processing",
        };
      case "shipped":
        return {
          color: "bg-purple-100 text-purple-800",
          icon: Truck,
          label: "Shipped",
        };
      case "delivered":
        return {
          color: "bg-green-100 text-green-800",
          icon: CheckCircle,
          label: "Delivered",
        };
      case "draft":
        return {
          color: "bg-blue-100 text-blue-800",
          icon: CheckCircle,
          label: "Draft",
        };
      case "cancelled":
        return {
          color: "bg-red-100 text-red-800",
          icon: AlertCircle,
          label: "Cancelled",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: Clock,
          label: status,
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge className={`${config.color} flex items-center gap-1`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
};

// Escrow Status Component
const EscrowStatus = ({ order }: { order: Order }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getEscrowStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return {
          status: "Payment Protected",
          color: "bg-blue-100 text-blue-800",
          icon: Shield,
          description: "Your payment is secured in escrow until delivery",
        };
      case "processing":
        return {
          status: "Order Processing",
          color: "bg-yellow-100 text-yellow-800",
          icon: Package,
          description: "Store is preparing your order",
        };
      case "shipped":
        return {
          status: "In Transit",
          color: "bg-purple-100 text-purple-800",
          icon: Truck,
          description: "Your order is on the way",
        };
      case "delivered":
        return {
          status: "Awaiting Confirmation",
          color: "bg-orange-100 text-orange-800",
          icon: Clock,
          description: "Please confirm receipt to release payment",
        };
      case "completed":
        return {
          status: "Payment Released",
          color: "bg-green-100 text-green-800",
          icon: ShieldCheck,
          description: "Transaction completed successfully",
        };
      case "cancelled":
        return {
          status: "Cancelled",
          color: "bg-red-100 text-red-800",
          icon: AlertTriangle,
          description: "Order was cancelled",
        };
      default:
        return {
          status: "Unknown",
          color: "bg-gray-100 text-gray-800",
          icon: Clock,
          description: "Status unknown",
        };
    }
  };

  const escrowInfo = getEscrowStatus(order.status);
  const Icon = escrowInfo.icon;
  if (
    order.delivery_approved_at ||
    order.refund_status === "success" ||
    order.refund_status === "pending" ||
    order.refund_status === "failed"
  ) {
    return null;
  }

  const isProtected = order.not_protected_by_escrow ? false : true;
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-gray-600" />
          {isProtected ? (
            <span className="font-medium">Escrow Protection</span>
          ) : (
            <span className="font-medium text-red-500">
              Not Protected By Escrow
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Badge className={`${escrowInfo.color} flex items-center gap-1`}>
          <Icon className="w-3 h-3" />
          {escrowInfo.status}
        </Badge>
      </div>

      <p className="text-sm text-gray-600">{escrowInfo.description}</p>

      {showDetails && (
        <div className="bg-gray-50 p-3 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span>Payment Status:</span>
            <span className="font-medium">
              {order.status === "delivered" ? "Held in Escrow" : "Protected"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Release Condition:</span>
            <span className="font-medium">
              {order.status === "delivered"
                ? "Confirm Receipt"
                : "Order Delivery"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Dispute Window:</span>
            <span className="font-medium">2 days after delivery</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Order Confirmation Component
const OrderConfirmation = ({ order }: { order: Order }) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const { mutateAsync: updateOrderEscrow, isPending } = useUpdateOrderEscrow(
    order.id
  );
  const { mutateAsync: submitFeedback, isPending: isSubmittingFeedback } =
    useSubmitFeedback();
  const handleConfirmOrder = async () => {
    try {
      setIsConfirmed(true);
      if (feedback && rating) {
        await submitFeedback({
          feedback,
          stars: rating,
          order_id: order.id,
        });
      }
      await updateOrderEscrow({
        delivery_approved_at: new Date(),
        refund_at: null,
        has_dispute: false,
        refund_requested: false,
        payment_status: "pending_disbursement",
      });
      toast.success(
        `Order confirmed! Payment will be released to the store.${
          feedback && rating ? ` Feedback: ${feedback} Rating: ${rating}` : ""
        }`
      );
      setShowConfirmation(false);
    } catch (error) {
      setIsConfirmed(false);
      toast.error("Failed to confirm order");
      setShowConfirmation(false);
      setRating(0);
      setFeedback("");
    }
    // Here you would typically make an API call to confirm the order
  };

  const handleRequestRefund = () => {
    toast.info("Refund request submitted. Store will be notified.");
    // Here you would typically make an API call to request refund
  };
  const isProtected = order.not_protected_by_escrow ? false : true;
  if (
    order.status !== "delivered" ||
    order.delivery_approved_at ||
    order.has_dispute ||
    order.refund_status === "success" ||
    order.refund_status === "pending" ||
    order.refund_status === "failed"
  ) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <h3 className="font-semibold text-orange-800">Action Required</h3>
        </div>
        <p className="text-sm text-orange-700 mb-3">
          Your order has been delivered. Please confirm receipt to release
          payment to the store.
        </p>

        {!isConfirmed ? (
          <div className="space-y-3">
            <Button
              onClick={() => setShowConfirmation(true)}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirm Order Received
            </Button>
            {/* <Button
              onClick={handleRequestRefund}
              variant="outline"
              className="w-full"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Request Refund
            </Button> */}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Order Confirmed</span>
            </div>
            {isProtected && (
              <p className="text-sm text-gray-600">
                Payment has been released to the store. Thank you for your
                purchase!
              </p>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-primary/50 backdrop-blur-md z-[101] flex items-center justify-center  p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              Confirm Order Receipt
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">
                  Rate your experience (1-5 stars)
                </label>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`p-1 ${
                        star <= rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Feedback (optional)
                </label>
                <Textarea
                  placeholder="How was your experience with this order?"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                disabled={isPending || isSubmittingFeedback}
                onClick={handleConfirmOrder}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isPending || isSubmittingFeedback ? (
                  <Loader2 className="w-4 h-4 mr-2" />
                ) : (
                  "Confirm Receipt"
                )}
              </Button>
              <Button
                onClick={() => setShowConfirmation(false)}
                variant="outline"
                className="flex-1"
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

// Dispute Resolution Component
const DisputeResolution = ({ order }: { order: Order }) => {
  console.log(order, "order");
  const [attachments, setattachments] = useState<File[]>([]);
  const [showCancelDisputeForm, setShowCancelDisputeForm] = useState(false);
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeDescription, setDisputeDescription] = useState("");
  const { mutateAsync: updateOrderEscrow, isPending } = useUpdateOrderEscrow(
    order.id
  );
  const { upload, isPending: isUploading } = useUploadImageUnprotected();
  const disputeReasons = [
    { value: "item_not_received", label: "Item not received" },
    { value: "item_damaged", label: "Item damaged or defective" },
    { value: "wrong_item", label: "Wrong item received" },
    { value: "not_as_described", label: "Not as described" },
    { value: "other", label: "Other" },
  ];

  const handleSubmitDispute = async () => {
    try {
      let attachmentUrls: { urls: string[] } = { urls: [] };
      if (attachments.length > 0) {
        attachmentUrls = await upload(attachments);
        console.log(attachmentUrls, "attachmentUrls");
      }
      await updateOrderEscrow({
        has_dispute: true,
        delivery_rejected_reason: disputeReason,
        delivery_rejected_at: new Date(),
        attachments: attachmentUrls.urls.join(",").toString(),
      });
      setShowDisputeForm(false);
      toast.success(
        "Dispute submitted successfully. Our team will review your case within 24 hours."
      );
    } catch (error) {
      console.log(error, "error");
      toast.error("Failed to submit dispute");
      setShowDisputeForm(false);
      setattachments([]);
      setDisputeReason("");
      setDisputeDescription("");
    }
  };
  const handleCancelDispute = async () => {
    await updateOrderEscrow({
      has_dispute: false,
      delivery_rejected_reason: null,
      delivery_rejected_at: null,
      attachments: null,
      payment_status: "held_in_escrow",
    });
    setShowCancelDisputeForm(false);
    toast.success("Dispute cancelled successfully");
    setattachments([]);
    setDisputeReason("");
    setDisputeDescription("");
  };
  // Here you would typically make an API call to submit the dispute

  // Only show dispute option for delivered orders within 7 days

  const disputeResolved =
    order.dispute_winner !== (null as "store" | "customer" | null);
  const storeGuilty = order.dispute_winner !== "store";

  const canDispute =
    order.status === "delivered" ||
    order.status === "completed" ||
    order.delivery_approved_at;
  if (order.has_dispute && !disputeResolved) {
    return (
      <>
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 shadow-sm">
          <h3 className="mb-2 text-lg font-semibold text-red-800 flex items-center gap-2">
            🚨 Dispute
          </h3>

          <div className="space-y-2 text-sm text-red-700">
            <p className="font-medium text-xl">
              Dispute has been opened for this order.
            </p>

            {order.delivery_rejected_reason && (
              <p className="text-lg">
                <span className="font-medium">Reason:</span>{" "}
                {order.delivery_rejected_reason}
              </p>
            )}

            {order.delivery_rejected_reason && (
              <p className="text-md">
                <span className="font-medium">Description:</span>{" "}
                {order.delivery_rejected_reason}
              </p>
            )}

            {order.dispute_proof && (
              <div className="flex flex-col items-start gap-2">
                <span className="font-medium  bg-general-primary text-white rounded-md px-2 py-1">
                  Attachments:
                </span>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  {order.dispute_proof
                    ?.split(",")
                    .filter((proof) => proof.trim() !== "")
                    .map((proof) => {
                      return (
                        <Image
                          key={proof}
                          src={proof}
                          alt="Dispute Proof"
                          width={100}
                          height={100}
                          className="rounded-lg w-32 h-32 object-center border border-red-200 object-cover"
                        />
                      );
                    })}
                </div>
                <p className="text-xs  bg-general-primary text-white px-2 py-1 italic uppercase font-medium">
                  We will wait for store to respond to your dispute.
                </p>
              </div>
            )}

            {!showCancelDisputeForm && (
              <Button
                onClick={() => setShowCancelDisputeForm(true)}
                variant="outline"
                className="w-full border-red-300 text-red-700 hover:bg-red-50"
              >
                {" "}
                Cancel Dispute
              </Button>
            )}

            {showCancelDisputeForm && (
              <div className=" p-3 rounded-lg border border-red-200">
                <h3 className="font-semibold text-red-800">Cancel Dispute</h3>
                <p className="text-sm text-red-700 mb-3">
                  Are you sure you want to cancel the dispute?
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleCancelDispute()}
                    variant="destructive"
                    className="w-full border-red-300 text-white hover:bg-red-50"
                  >
                    {" "}
                    {isPending || isUploading ? (
                      <Loader2 className="w-4 h-4 mr-2" />
                    ) : (
                      "Confirm Cancel"
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowCancelDisputeForm(false)}
                    variant="outline"
                    className="w-full border-red-300 text-red-700 hover:bg-red-50"
                  >
                    {" "}
                    Cancel
                  </Button>{" "}
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  if (disputeResolved) {
    return (
      <DisputeResolutionResult
        disputeResolved={disputeResolved}
        storeGuilty={storeGuilty}
        reason={order.dispute_resolved_reason || ""}
        refundAmount={order.net_total}
        refundType={storeGuilty ? "full" : "partial"}
        orderId={order.id.toString()}
        refundStatus={order.refund_status}
        storeId={order.store_id?.toString() || ""}
        paymentRef={order.paymentId || ""}
      />
    );
  }

  if (
    !canDispute ||
    order.delivery_approved_at ||
    order.has_dispute ||
    order.refund_status === "success" ||
    order.refund_status === "pending" ||
    order.refund_status === "failed"
  ) {
    return null;
  }
  const isProtected = order.not_protected_by_escrow ? false : true;
  if (!isProtected)
    return (
      <div className="space-y-3">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-800">Need Help?</h3>
          </div>
          <p className="text-sm text-red-700 mb-3">
            If you have an issue with your order, you can open a dispute within
            2 days of delivery.
          </p>
          <p className="text-sm bg-red-700 text-white w-fit rounded-md px-3 py-1 mb-3">
            Note:This order is not protected so refunds depends on store and not
            held in escrow
          </p>

          <Button
            onClick={() => setShowDisputeForm(true)}
            variant="outline"
            className="w-full border-red-300 text-red-700 hover:bg-red-50"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Open Dispute
          </Button>
        </div>

        {/* Dispute Form Modal */}
        {showDisputeForm && (
          <div className="fixed inset-0 bg-primary/50 backdrop-blur-lg flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Open Dispute</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">
                    Reason for dispute
                  </label>
                  <Select
                    value={disputeReason}
                    onValueChange={setDisputeReason}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {disputeReasons.map((reason) => (
                        <SelectItem key={reason.value} value={reason.value}>
                          {reason.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Please describe the issue in detail..."
                    value={disputeDescription}
                    onChange={(e) => setDisputeDescription(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Input
                  accept="image/*"
                  multiple
                  type="file"
                  onChange={(e) => {
                    const files = e.target.files
                      ? Array.from(e.target.files)
                      : [];
                    files.forEach((file) => {
                      if (file.size > 5 * 1024 * 1024) {
                        toast.error("File size must be less than 5MB");
                        return;
                      }
                    });
                    setattachments(
                      e.target.files ? Array.from(e.target.files) : []
                    );
                  }}
                />
                <div className="flex  items-center gap-2">
                  {attachments.map((attachment) => (
                    <div className="relative w-10 h-10" key={attachment.name}>
                      <Image
                        width={100}
                        height={100}
                        src={URL.createObjectURL(attachment)}
                        alt={attachment.name}
                        className="w-10 h-10 object-cover rounded-md"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setattachments(
                            attachments.filter(
                              (a) => a.name !== attachment.name
                            )
                          )
                        }
                        className="absolute hover:text-red-400 right-3 top-3 cursor-pointer text-white w-5 h-5"
                        disabled={isUploading}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button
                  onClick={handleSubmitDispute}
                  disabled={
                    !disputeReason ||
                    !disputeDescription.trim() ||
                    isPending ||
                    isUploading
                  }
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {isPending || isUploading ? (
                    <Loader2 className="w-4 h-4 mr-2" />
                  ) : (
                    "Submit Dispute"
                  )}
                </Button>
                <Button
                  onClick={() => setShowDisputeForm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  return (
    <div className="space-y-3">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h3 className="font-semibold text-red-800">Need Help?</h3>
        </div>
        <p className="text-sm text-red-700 mb-3">
          If you have an issue with your order, you can open a dispute within 2
          days of delivery.
        </p>

        <Button
          onClick={() => setShowDisputeForm(true)}
          variant="outline"
          className="w-full border-red-300 text-red-700 hover:bg-red-50"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Open Dispute
        </Button>
      </div>

      {/* Dispute Form Modal */}
      {showDisputeForm && (
        <div className="fixed inset-0 bg-primary/50 backdrop-blur-lg flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Open Dispute</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">
                  Reason for dispute
                </label>
                <Select value={disputeReason} onValueChange={setDisputeReason}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {disputeReasons.map((reason) => (
                      <SelectItem key={reason.value} value={reason.value}>
                        {reason.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Please describe the issue in detail..."
                  value={disputeDescription}
                  onChange={(e) => setDisputeDescription(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Input
                accept="image/*"
                multiple
                type="file"
                onChange={(e) => {
                  const files = e.target.files
                    ? Array.from(e.target.files)
                    : [];
                  files.forEach((file) => {
                    if (file.size > 5 * 1024 * 1024) {
                      toast.error("File size must be less than 5MB");
                      return;
                    }
                  });
                  setattachments(
                    e.target.files ? Array.from(e.target.files) : []
                  );
                }}
              />
              <div className="flex  items-center gap-2">
                {attachments.map((attachment) => (
                  <div className="relative w-10 h-10" key={attachment.name}>
                    <Image
                      width={100}
                      height={100}
                      src={URL.createObjectURL(attachment)}
                      alt={attachment.name}
                      className="w-10 h-10 object-cover rounded-md"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setattachments(
                          attachments.filter((a) => a.name !== attachment.name)
                        )
                      }
                      className="absolute hover:text-red-400 right-3 top-3 cursor-pointer text-white w-5 h-5"
                      disabled={isUploading}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                onClick={handleSubmitDispute}
                disabled={
                  !disputeReason ||
                  !disputeDescription.trim() ||
                  isPending ||
                  isUploading
                }
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {isPending || isUploading ? (
                  <Loader2 className="w-4 h-4 mr-2" />
                ) : (
                  "Submit Dispute"
                )}
              </Button>
              <Button
                onClick={() => setShowDisputeForm(false)}
                variant="outline"
                className="flex-1"
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

// Order Timeline Component
const OrderTimeline = ({ order }: { order: Order }) => {
  const timelineSteps = [
    {
      status: "pending",
      title: "Order Placed",
      description: "Your order has been placed and payment is secured",
      icon: CreditCard,
      completed: true,
    },
    {
      status: "processing",
      title: "Processing",
      description: "Store is preparing your order",
      icon: Package,
      completed:
        ["processing", "shipped", "delivered", "completed"].includes(
          order.status
        ) || order.delivery_approved_at,
    },
    {
      status: "shipped",
      title: "Shipped",
      description: "Your order is on the way",
      icon: Truck,
      completed:
        ["shipped", "delivered", "completed"].includes(order.status) ||
        order.delivery_approved_at,
    },
    {
      status: "delivered",
      title: "Delivered",
      description: "Your order has been delivered",
      icon: MapPin,
      completed:
        ["delivered", "completed"].includes(order.status) ||
        order.delivery_approved_at,
    },
    {
      status: "completed",
      title: "Completed",
      description: "Transaction completed",
      icon: CheckCircle,
      completed: order.status === "completed" || order.delivery_approved_at,
    },
  ];

  if (order.refund_status === "success" || order.refund_status === "pending") {
    return null;
  }
  return (
    <div className="space-y-4">
      <h4 className="font-medium">Order Timeline</h4>
      <div className="space-y-3">
        {timelineSteps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.status === order.status;
          const isCompleted = step.completed;

          return (
            <div key={step.status} className="flex items-start gap-3">
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? "bg-green-100 text-green-600"
                    : isActive
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div
                  className={`font-medium ${
                    isCompleted
                      ? "text-green-800"
                      : isActive
                      ? "text-blue-800"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </div>
                <div className="text-sm text-gray-600">{step.description}</div>
                {isActive && !order.delivery_approved_at && (
                  <div className="text-xs text-blue-600 mt-1">
                    Current Status
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Store order group component
const StoreOrderGroup = ({
  store,
  orders,
}: {
  store: StoreType;
  orders: Order[];
}) => {
  const totalAmount = orders.reduce((sum, order) => sum + order.total, 0);
  const orderCount = orders.length;

  return (
    <Card className="p-4 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg capitalize px-3 bg-general-primary text-white rounded-md">
            {store.name}
          </CardTitle>
          <Badge variant="outline">
            {orderCount} order{orderCount > 1 ? "s" : ""}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">
          Total: ₦{totalAmount.toLocaleString()}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border border-gray-200 rounded-lg p-4 space-y-4"
          >
            {/* Order Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Order #{order.id}</span>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="text-right">
                <p className="font-semibold">₦{order.total.toLocaleString()}</p>
                <p className="text-xs text-gray-500">
                  {order.orderItems?.length || 0} item
                  {(order.orderItems?.length || 0) > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Escrow Status */}
            <EscrowStatus order={order} />

            {/* Order Confirmation (only for delivered orders) */}
            <OrderConfirmation order={order} />

            {/* Dispute Resolution */}
            <DisputeResolution order={order} />

            {/* Order Timeline */}
            <OrderTimeline order={order} />

            {/* Order Items */}
            <div className="border-t pt-3">
              <h5 className="font-medium mb-2">Items:</h5>
              <div className="space-y-2">
                {order.orderItems?.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {item.Product?.Name || `Item ${index + 1}`}
                      </p>
                      <p className="text-xs text-gray-600">
                        Quantity: {item.Quantity} × ₦
                        {item.UnitPrice?.toLocaleString() || "0"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">
                        ₦ {item.TotalPrice?.toLocaleString() || "0"}
                      </p>
                    </div>
                  </div>
                )) || (
                  <p className="text-gray-500 italic text-sm">No items found</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

// Order Receipt Component
const OrderReceipt = ({
  orders,
  purchaseId,
}: {
  orders: Order[];
  purchaseId: string;
}) => {
  const [showReceipt, setShowReceipt] = useState(false);

  // Calculate totals
  const totalAmount = orders.reduce((sum, order) => sum + order.total, 0);
  const totalItems = orders.reduce(
    (sum, order) => sum + (order.orderItems?.length || 0),
    0
  );
  const totalOrders = orders.length;

  // Group orders by store for receipt
  const ordersByStore = useMemo(() => {
    const storeMap = new Map<
      number,
      { store: Partial<StoreType>; orders: Order[] }
    >();

    orders.forEach((order) => {
      //@ts-ignore
      if (order.store_id) {
        //@ts-ignore
        const storeId = order.store_id;
        //@ts-ignore
        if (!storeMap.has(storeId)) {
          //@ts-ignore
          storeMap.set(storeId, { store: order.store, orders: [] });
        }
        storeMap.get(storeId)!.orders.push(order);
      }
    });

    return storeMap;
  }, [orders]);

  const downloadReceipt = () => {
    const receiptContent = generateReceiptHTML(
      orders,
      purchaseId,
      totalAmount,
      totalItems,
      totalOrders,
      ordersByStore
    );

    // Create blob and download
    const blob = new Blob([receiptContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `order-receipt-${purchaseId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Receipt downloaded successfully!");
  };

  const printReceipt = () => {
    const receiptContent = generateReceiptHTML(
      orders,
      purchaseId,
      totalAmount,
      totalItems,
      totalOrders,
      ordersByStore
    );
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(receiptContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <>
      <Button
        onClick={() => setShowReceipt(true)}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
      >
        <Receipt className="w-4 h-4" />
        View Receipt
      </Button>

      {showReceipt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-[101] p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Order Receipt
              </h2>
              <div className="flex gap-2">
                <Button onClick={downloadReceipt} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button onClick={printReceipt} variant="outline" size="sm">
                  Print
                </Button>
                <Button
                  onClick={() => setShowReceipt(false)}
                  variant="outline"
                  size="sm"
                >
                  Close
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[70vh] p-6">
              <div className="receipt-content">
                {/* Receipt Header */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Order Receipt
                  </h1>
                  <p className="text-gray-600">Purchase ID: {purchaseId}</p>
                  <p className="text-gray-600">
                    Date: {new Date().toLocaleDateString()}
                  </p>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Orders:</span>
                      <span className="font-semibold ml-2">{totalOrders}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Items:</span>
                      <span className="font-semibold ml-2">{totalItems}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-semibold ml-2">
                        ₦{totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Orders by Store */}
                {Array.from(ordersByStore.values()).map(
                  ({ store, orders: storeOrders }) => (
                    <div key={store.id} className="mb-8">
                      <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <h3 className="text-lg font-semibold text-blue-800">
                          {store.name}
                        </h3>
                        <p className="text-sm text-blue-600">
                          {storeOrders.length} order
                          {storeOrders.length > 1 ? "s" : ""} • Total: ₦
                          {storeOrders
                            .reduce((sum, order) => sum + order.total, 0)
                            .toLocaleString()}
                        </p>
                      </div>

                      {storeOrders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-gray-200 rounded-lg p-4 mb-4"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold">
                                Order #{order.id}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Status:{" "}
                                <OrderStatusBadge status={order.status} />
                              </p>
                              <p className="text-sm text-gray-600">
                                Placed:{" "}
                                {new Date(
                                  order.placedAt || order.placed_at
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold">
                                ₦{order.total.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="border-t pt-3">
                            <h5 className="font-medium mb-2">Items:</h5>
                            <div className="space-y-2">
                              {order.orderItems?.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-center py-2 border-b border-gray-100"
                                >
                                  <div className="flex-1">
                                    <p className="font-medium">
                                      {item.Product?.Name ||
                                        `Item ${index + 1}`}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Quantity: {item.Quantity} × ₦
                                      {item.UnitPrice?.toLocaleString() || "0"}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold">
                                      ₦
                                      {(
                                        (item.Quantity || 0) *
                                        (item.UnitPrice || 0)
                                      ).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              )) || (
                                <p className="text-gray-500 italic">
                                  No items found
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}

                {/* Footer */}
                <div className="text-center mt-8 pt-6 border-t">
                  <p className="text-gray-600 text-sm">
                    Thank you for your purchase! For support, contact us through
                    the chat.
                  </p>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </>
  );
};

// Generate HTML content for receipt
const generateReceiptHTML = (
  orders: Order[],
  purchaseId: string,
  totalAmount: number,
  totalItems: number,
  totalOrders: number,
  ordersByStore: Map<number, { store: Partial<StoreType>; orders: Order[] }>
) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Order Receipt - ${purchaseId}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .store-section { margin-bottom: 30px; }
        .store-header { background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
        .order { border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 15px; }
        .order-header { display: flex; justify-content: space-between; margin-bottom: 15px; }
        .items { border-top: 1px solid #eee; padding-top: 15px; }
        .item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
        .status { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        .status.pending { background: #fff3cd; color: #856404; }
        .status.processing { background: #d1ecf1; color: #0c5460; }
        .status.shipped { background: #d4edda; color: #155724; }
        .status.delivered { background: #d1ecf1; color: #0c5460; }
        .status.cancelled { background: #f8d7da; color: #721c24; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Order Receipt</h1>
        <p>Purchase ID: ${purchaseId}</p>
        <p>Date: ${new Date().toLocaleDateString()}</p>
      </div>

      <div class="summary">
        <h3>Order Summary</h3>
        <p><strong>Total Orders:</strong> ${totalOrders}</p>
        <p><strong>Total Items:</strong> ${totalItems}</p>
        <p><strong>Total Amount:</strong> ₦${totalAmount.toLocaleString()}</p>
      </div>

      ${Array.from(ordersByStore.values())
        .map(
          ({ store, orders: storeOrders }) => `
        <div class="store-section">
          <div class="store-header">
            <h3>${store.name}</h3>
            <p>${storeOrders.length} order${
            storeOrders.length > 1 ? "s" : ""
          } • Total: ₦${storeOrders
            .reduce((sum, order) => sum + order.total, 0)
            .toLocaleString()}</p>
          </div>
          
          ${storeOrders
            .map(
              (order) => `
            <div class="order">
              <div class="order-header">
                <div>
                  <h4>Order #${order.id}</h4>
                  <p>Status: <span class="status ${order.status.toLowerCase()}">${
                order.status
              }</span></p>
                  <p>Placed: ${new Date(
                    order.placedAt || order.placed_at
                  ).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3>₦${order.total.toLocaleString()}</h3>
                </div>
              </div>
              
              <div class="items">
                <h5>Items:</h5>
                ${
                  order.orderItems
                    ?.map(
                      (item, index) => `
                  <div class="item">
                    <div>
                      <strong>${
                        item.Product?.Name || `Item ${index + 1}`
                      }</strong><br>
                      <small>Quantity: ${item.Quantity} × ₦${
                        item.UnitPrice?.toLocaleString() || "0"
                      }</small>
                    </div>
                    <div>
                      <strong>₦${(
                        (item.Quantity || 0) * (item.UnitPrice || 0)
                      ).toLocaleString()}</strong>
                    </div>
                  </div>
                `
                    )
                    .join("") || "<p><em>No items found</em></p>"
                }
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      `
        )
        .join("")}

      <div class="footer">
        <p>Thank you for your purchase! For support, contact us through the chat.</p>
      </div>
    </body>
    </html>
  `;
};

// Preconfigured messages
const PRECONFIGURED_MESSAGES = [
  {
    id: "order_status",
    title: "Check Order Status",
    message:
      "Hi! Could you please provide an update on my order status? I'd like to know when it will be shipped.",
  },
  {
    id: "shipping_time",
    title: "Shipping Timeline",
    message:
      "Hello! What is the estimated delivery time for my order? When can I expect to receive it?",
  },
  {
    id: "order_modification",
    title: "Modify Order",
    message:
      "Hi there! I need to make some changes to my order. Is it possible to modify the items or delivery address?",
  },
  {
    id: "refund_request",
    title: "Refund Inquiry",
    message:
      "Hello! I would like to request a refund for my order. Could you please guide me through the process?",
  },
  {
    id: "product_question",
    title: "Product Question",
    message:
      "Hi! I have a question about one of the products in my order. Could you provide more details about it?",
  },
  {
    id: "delivery_issue",
    title: "Delivery Issue",
    message:
      "Hello! I'm experiencing an issue with my delivery. Could you help me resolve this?",
  },
];

// Multi-store message box component
const MultiStoreMessageBox = ({
  ordersByStore,
}: {
  ordersByStore: Map<number, { store: Partial<StoreType>; orders: Order[] }>;
}) => {
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [showPreconfigured, setShowPreconfigured] = useState(false);

  // Store conversations state
  const [storeConversations, setStoreConversations] = useState<
    Map<
      number,
      Array<{
        id: string;
        text: string;
        timestamp: Date;
        isUser: boolean;
      }>
    >
  >(new Map());

  // Initialize conversations for each store
  const initializeStoreConversations = useCallback(() => {
    setStoreConversations((prev) => {
      const newConversations = new Map(prev);
      ordersByStore.forEach(({ store }, storeId) => {
        if (!newConversations.has(storeId)) {
          newConversations.set(storeId, []);
        }
      });
      return newConversations;
    });
  }, [ordersByStore]);

  // Initialize conversations on mount
  useEffect(() => {
    initializeStoreConversations();
  }, [initializeStoreConversations]);

  const currentMessages = selectedStoreId
    ? storeConversations.get(selectedStoreId) || []
    : [];
  const selectedStore = selectedStoreId
    ? ordersByStore.get(selectedStoreId)
    : null;

  const handleSendMessage = () => {
    if (!message.trim() || !selectedStoreId) return;

    const newMessage = {
      id: Date.now().toString(),
      text: message,
      timestamp: new Date(),
      isUser: true,
    };

    setStoreConversations((prev) => {
      const newMap = new Map(prev);
      const currentStoreMessages = newMap.get(selectedStoreId) || [];
      newMap.set(selectedStoreId, [...currentStoreMessages, newMessage]);
      return newMap;
    });
    setMessage("");

    // Simulate store reply after 2 seconds
    setTimeout(() => {
      const reply = {
        id: (Date.now() + 1).toString(),
        text: `Thank you for your message! We'll get back to you shortly regarding your order from ${selectedStore?.store.name}.`,
        timestamp: new Date(),
        isUser: false,
      };

      setStoreConversations((prev) => {
        const newMap = new Map(prev);
        const currentStoreMessages = newMap.get(selectedStoreId) || [];
        newMap.set(selectedStoreId, [...currentStoreMessages, reply]);
        return newMap;
      });
      toast.success(`New reply from ${selectedStore?.store.name}!`);
    }, 2000);

    toast.success("Message sent!");
  };

  const handlePreconfiguredMessage = (
    preMessage: (typeof PRECONFIGURED_MESSAGES)[0]
  ) => {
    setMessage(preMessage.message);
    setShowPreconfigured(false);
  };

  const handleStoreChange = (storeId: string) => {
    setSelectedStoreId(parseInt(storeId));
    setMessage("");
  };

  return (
    <Card className=" relative">
      <div className="absolute w-full z-[10] bottom-0 top-0 left-0 backdrop-blur-md  pointer-events-none flex items-center gap-2  justify-center  flex-col bg-black/40 text-white px-2 py-1 rounded-md">
        <AlertTriangle className="w-8 h-8" />
        <span className="text-lg">Feature upcoming</span>
        <span className="text-xs">
          We are working on this feature and it will be available soon
        </span>
      </div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Store Support
        </CardTitle>

        {/* Store Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Select Store to Message:
          </label>
          <Select
            value={selectedStoreId?.toString()}
            onValueChange={handleStoreChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a store to contact" />
            </SelectTrigger>
            <SelectContent>
              {Array.from(ordersByStore.entries()).map(
                ([storeId, { store }]) => (
                  <SelectItem key={storeId} value={storeId.toString()}>
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4" />
                      <span>{store.name}</span>
                      <Badge variant="outline" className="ml-2">
                        {ordersByStore.get(storeId)?.orders.length} orders
                      </Badge>
                    </div>
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="flex relative flex-col h-[500px]">
        {selectedStoreId ? (
          <>
            {/* Store Info */}
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800">
                  {selectedStore?.store.name}
                </span>
              </div>
              <p className="text-sm text-blue-600">
                {selectedStore?.orders.length} order
                {selectedStore?.orders.length !== 1 ? "s" : ""} • Total: ₦
                {selectedStore?.orders
                  .reduce((sum, order) => sum + order.total, 0)
                  .toLocaleString()}
              </p>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 mb-4">
              <div className="space-y-3">
                {currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.isUser
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.isUser ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-gray-200 my-3" />

            {/* Preconfigured Messages */}
            <div className="mb-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreconfigured(!showPreconfigured)}
                className="w-full"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Quick Messages
              </Button>

              {showPreconfigured && (
                <ScrollArea className="h-[200px] border border-general/30 rounded-md p-2 shadow shadow-general/50 absolute  bottom-1/2 w-full">
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium mb-2">
                      Choose a quick message:
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {PRECONFIGURED_MESSAGES.map((preMsg) => (
                        <Button
                          key={preMsg.id}
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePreconfiguredMessage(preMsg)}
                          className="justify-start text-left h-auto p-2"
                        >
                          <div>
                            <p className="font-medium text-xs">
                              {preMsg.title}
                            </p>
                            <p className="text-xs text-gray-600 truncate">
                              {preMsg.message}
                            </p>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>{" "}
                </ScrollArea>
              )}
            </div>

            {/* Message Input */}
            <div className="space-y-2">
              <Textarea
                placeholder={`Type your message to ${selectedStore?.store.name}...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[60px] resize-none"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                Send to {selectedStore?.store.name}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a Store</h3>
              <p className="text-gray-600">
                Choose a store from the dropdown above to start messaging
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const { data: orders, isLoading: isLoadingOrders } =
    useGetAllPurchaseOrders(orderId);

  // Group orders by store
  const ordersByStore = useMemo(() => {
    if (!orders) return new Map();

    const storeMap = new Map<
      number,
      { store: Partial<StoreType>; orders: Order[] }
    >();

    orders?.forEach((order) => {
      console.log(order, "ORDERS");
      //@ts-ignore
      if (order.store_id) {
        //@ts-ignore
        const storeId = order.store_id;
        //@ts-ignore
        if (!storeMap.has(storeId)) {
          //@ts-ignore
          storeMap.set(storeId, { store: order.store, orders: [] });
        }
        storeMap.get(storeId)!.orders.push(order);
      }
    });

    return storeMap;
  }, [orders]);

  if (isLoadingOrders) {
    return <OrderDetailsSkeleton />;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col gap-5 p-5 rounded-xl min-h-screen h-full w-full">
        <h1 className="text-2xl font-bold mt-10">Order Details</h1>
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
          <p className="text-gray-600">
            We couldn&apos;t find any orders for this purchase ID.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 lg:px-20 px-5 p-5 rounded-xl min-h-screen h-full w-full">
      <div className="flex items-center my-20 justify-between">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <div className="flex items-center gap-4">
          <OrderReceipt orders={orders} purchaseId={orderId} />
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">
              Purchase ID: {orderId}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders by Store */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold">Orders by Store</h2>
          {ordersByStore.size === 0 ? (
            <Card className="p-8 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No Store Information
              </h3>
              <p className="text-gray-600">
                Store details are not available for these orders.
              </p>
            </Card>
          ) : (
            Array.from(ordersByStore.values()).map(({ store, orders }) => (
              <StoreOrderGroup key={store.id} store={store} orders={orders} />
            ))
          )}
        </div>

        {/* Multi-Store Message Box */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Store Support</h2>
          <MultiStoreMessageBox ordersByStore={ordersByStore} />
        </div>
      </div>
    </div>
  );
}
