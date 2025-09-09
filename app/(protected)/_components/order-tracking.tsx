/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Order } from "@/constants/types";
import {
  CheckCircle,
  Clock,
  Package,
  Truck,
  MapPin,
  Phone,
  Calendar,
  User
} from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFetchUserStore } from "@/app/(handlers)/auth-handlers/auth";

interface OrderTrackingProps {
  order: Order;
  children?: React.ReactNode;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

interface TrackingEvent {
  id: string;
  status: string;
  title: string;
  description: string;
  timestamp: string;
  location?: string;
  completed: boolean;
}

export default function OrderTracking({
  order,
  children,
  isOpen,
  setIsOpen
}: OrderTrackingProps) {
  const { store: storeDB, isLoading: storeLoading } = useFetchUserStore();
  const store = storeDB.store;
  // Generate tracking events based on order status and data
  const generateTrackingEvents = (): TrackingEvent[] => {
    const events: TrackingEvent[] = [];
    const orderDate = order.placedAt || order.placed_at;
    const arrivalDate = order.arrival_date;

    // Order placed
    events.push({
      id: "placed",
      status: "placed",
      title: "Order Placed",
      description: "Your order has been successfully placed",
      timestamp: orderDate || new Date().toISOString(),
      completed: true
    });

    // Order confirmed
    if (order.status !== "pending") {
      events.push({
        id: "confirmed",
        status: "confirmed",
        title: "Order Confirmed",
        description: "Your order has been confirmed by the store",
        timestamp: orderDate || new Date().toISOString(),
        completed: true
      });
    }

    // Processing
    if (["processing", "shipped", "delivered"].includes(order.status)) {
      events.push({
        id: "processing",
        status: "processing",
        title: "Processing",
        description: "Your order is being prepared for shipment",
        timestamp: orderDate || new Date().toISOString(),
        completed: true
      });
    }

    // Shipped
    if (["shipped", "delivered"].includes(order.status)) {
      events.push({
        id: "shipped",
        status: "shipped",
        title: "Shipped",
        description:
          order.deliveryMode === "store"
            ? "Your order is ready for pickup at the store"
            : "Your order has been shipped and is on its way",
        timestamp: orderDate || new Date().toISOString(),
        location:
          order.deliveryMode === "store"
            ? `${store?.name || "Store"}, ${store?.state || "Location"}`
            : "In Transit",
        completed: true
      });
    }

    // Delivered
    if (order.status === "delivered") {
      events.push({
        id: "delivered",
        status: "delivered",
        title: "Delivered",
        description: "Your order has been successfully delivered",
        timestamp:
          (typeof arrivalDate === "string"
            ? arrivalDate
            : arrivalDate?.toISOString()) || new Date().toISOString(),
        location: order.address
          ? `${order.address.Street || order.address.street || ""}, ${
              order.address.City || order.address.city || ""
            }`
          : "Delivery Address",
        completed: true
      });
    }

    // Add estimated delivery if not delivered
    if (order.status !== "delivered" && arrivalDate) {
      events.push({
        id: "estimated",
        status: "estimated",
        title: "Estimated Delivery",
        description: "Expected delivery date",
        timestamp:
          typeof arrivalDate === "string"
            ? arrivalDate
            : arrivalDate?.toISOString(),
        completed: false
      });
    }

    return events;
  };

  const trackingEvents = generateTrackingEvents();
  const currentStatus = order.status;

  const getStatusIcon = (status: string, completed: boolean) => {
    if (completed) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }

    switch (status) {
      case "placed":
      case "confirmed":
        return <Clock className="h-5 w-5 text-blue-600" />;
      case "processing":
        return <Package className="h-5 w-5 text-yellow-600" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-purple-600" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string, completed: boolean) => {
    if (completed) return "text-green-600";

    switch (status) {
      case "placed":
      case "confirmed":
        return "text-blue-600";
      case "processing":
        return "text-yellow-600";
      case "shipped":
        return "text-purple-600";
      case "delivered":
        return "text-green-600";
      default:
        return "text-gray-400";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* <DialogTrigger asChild>{children}</DialogTrigger> */}
      <DialogContent className="w-[600px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
        <DialogTitle className="text-xl font-semibold mb-4">
          Track Order #{order.id}
        </DialogTitle>

        <div className="space-y-6">
          {/* Order Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Order Details
                </h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <strong>Order ID:</strong> #{order.id}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="capitalize">{currentStatus}</span>
                  </p>
                  <p>
                    <strong>Total:</strong> ₦
                    {order.net_total || order.total || 0}
                  </p>
                  <p>
                    <strong>Items:</strong> {order.orderItems?.length || 0}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Delivery Info
                </h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <strong>Mode:</strong> {order.deliveryMode || "Standard"}
                  </p>
                  <p>
                    <strong>Agent:</strong> {order.agent?.name || "N/A"}
                  </p>
                  <p>
                    <strong>Provider:</strong>{" "}
                    {order.thirdPartyProvider || "Internal"}
                  </p>
                  {order.thirdPartyTrackingId && (
                    <p>
                      <strong>Tracking ID:</strong> {order.thirdPartyTrackingId}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          {(order.contact || order.address) && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Contact & Address
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {order.contact && (
                  <div>
                    <h5 className="font-medium text-sm text-gray-700 mb-1">
                      Contact Person
                    </h5>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        {order.contact.FirstName || order.contact.name}{" "}
                        {order.contact.LastName || ""}
                      </p>
                      <p className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {order.contact.Phone || order.contact.phone || "N/A"}
                      </p>
                      <p>
                        {order.contact.Email || order.contact.email || "N/A"}
                      </p>
                    </div>
                  </div>
                )}
                {order.address && (
                  <div>
                    <h5 className="font-medium text-sm text-gray-700 mb-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Delivery Address
                    </h5>
                    <div className="text-sm text-gray-600">
                      <p>
                        {order.address.Street || order.address.street || "N/A"}
                      </p>
                      <p>
                        {order.address.City || order.address.city || "N/A"},{" "}
                        {order.address.State || order.address.state || "N/A"}
                      </p>
                      <p>
                        {order.address.Country ||
                          order.address.country ||
                          "N/A"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tracking Timeline */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Order Progress</h4>
            <div className="space-y-4">
              {trackingEvents.map((event, index) => (
                <div key={event.id} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(event.status, event.completed)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5
                        className={`font-medium ${getStatusColor(
                          event.status,
                          event.completed
                        )}`}
                      >
                        {event.title}
                      </h5>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {new Date(event.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {event.description}
                    </p>
                    {event.location && (
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
            {order.thirdPartyTrackingId && (
              <Button
                onClick={() =>
                  window.open(
                    `https://tracking.example.com/${order.thirdPartyTrackingId}`,
                    "_blank"
                  )
                }
                className="bg-blue-600 hover:bg-blue-700"
              >
                Track with Provider
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
