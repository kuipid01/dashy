/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Truck,
  MapPin,
  Star,
  Clock,
  Send,
  Paperclip
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

interface OrderDetailsProps {
  orderData: any;
  onBack: () => void;
}

export function OrderDetails({ orderData, onBack }: OrderDetailsProps) {
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "store",
      message:
        "Hello! Your order has been shipped and is on its way. Tracking number: TRK123456789",
      timestamp: "2024-01-18 10:30 AM",
      senderName: "TechHub Support"
    }
  ]);

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        sender: "customer",
        message: chatMessage,
        timestamp: new Date().toLocaleString(),
        senderName: "You"
      };
      setChatMessages([...chatMessages, newMessage]);
      setChatMessage("");

      // Simulate store response
      setTimeout(() => {
        const storeResponse = {
          id: chatMessages.length + 2,
          sender: "store",
          message:
            "Thanks for your message! We'll look into this and get back to you shortly.",
          timestamp: new Date().toLocaleString(),
          senderName: "TechHub Support"
        };
        setChatMessages((prev) => [...prev, storeResponse]);
      }, 2000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-success text-success-foreground";
      case "in transit":
        return "bg-primary text-primary-foreground";
      case "processing":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Order #{orderData.id}</h3>
          <p className="text-sm text-muted-foreground">
            Placed on {new Date(orderData.orderDate).toLocaleDateString()}
          </p>
        </div>
        <Badge className={getStatusColor(orderData.status)}>
          {orderData.status}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Order Details */}
        <div className="space-y-6">
          {/* Store Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Store Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={orderData.store.logo || "/placeholder.svg"}
                    alt={orderData.store.name}
                  />
                  <AvatarFallback>
                    {orderData.store.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium">{orderData.store.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="w-3 h-3 fill-current text-warning" />
                    <span>{orderData.store.rating}</span>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>Responds in {orderData.store.responseTime}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {orderData.items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                >
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">{item.name}</h5>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-medium">${item.price}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-3 border-t border-border">
                <span className="font-medium">Total</span>
                <span className="font-bold text-lg">${orderData.total}</span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                <p className="font-medium">{orderData.shippingAddress.name}</p>
                <p>{orderData.shippingAddress.street}</p>
                <p>
                  {orderData.shippingAddress.city},{" "}
                  {orderData.shippingAddress.state}{" "}
                  {orderData.shippingAddress.zip}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Order Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orderData.timeline.map((step: any, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        step.completed ? "bg-success" : "bg-muted"
                      }`}
                    />
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          step.completed
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.status}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {step.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Chat */}
        <div className="space-y-6">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Chat with Store</CardTitle>
              <p className="text-xs text-muted-foreground">
                Get instant support from {orderData.store.name}
              </p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "customer"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.sender === "customer"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender === "customer"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="flex-1 min-h-[40px] max-h-[100px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-10 w-10 p-0 bg-transparent"
                    >
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSendMessage}
                      disabled={!chatMessage.trim()}
                      className="h-10 w-10 p-0"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
