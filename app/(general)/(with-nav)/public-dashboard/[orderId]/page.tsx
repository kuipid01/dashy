/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  Truck,
  MapPin,
  Star,
  Clock,
  Send,
  Paperclip,
  Package,
  CheckCircle,
  Calendar,
  Phone,
  Mail,
  User,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = params.orderId as string
  const email = searchParams.get("email")

  const [orderData, setOrderData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [chatMessage, setChatMessage] = useState("")
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "store",
      message: "Hello! Your order has been shipped and is on its way. Tracking number: TRK123456789",
      timestamp: "2024-01-18 10:30 AM",
      senderName: "TechHub Support",
    },
  ])

  useEffect(() => {
    // Simulate fetching order data
    setTimeout(() => {
      const mockOrderData = {
        id: orderId,
        status: "In Transit",
        email: email,
        items: [
          {
            id: 1,
            name: "Wireless Headphones Pro",
            quantity: 1,
            price: 299.99,
            image: "/wireless-headphones.png",
          },
          {
            id: 2,
            name: "USB-C Cable",
            quantity: 2,
            price: 19.99,
            image: "/usb-cable.png",
          },
        ],
        total: 339.97,
        orderDate: "2024-01-15",
        estimatedDelivery: "2024-01-20",
        trackingNumber: "TRK123456789",
        store: {
          name: "TechHub Electronics",
          logo: "/electronics-store-logo.png",
          rating: 4.8,
          responseTime: "< 2 hours",
        },
        shippingAddress: {
          name: "John Doe",
          street: "123 Main Street",
          city: "New York",
          state: "NY",
          zip: "10001",
        },
        contact: {
          name: "John Doe",
          phone: "+1 (555) 123-4567",
          email: email || "john.doe@example.com",
        },
        timeline: [
          { status: "Order Placed", date: "2024-01-15", time: "10:30 AM", completed: true },
          { status: "Processing", date: "2024-01-16", time: "09:15 AM", completed: true },
          { status: "Shipped", date: "2024-01-17", time: "02:45 PM", completed: true },
          { status: "In Transit", date: "2024-01-18", time: "08:00 AM", completed: true },
          { status: "Delivered", date: "2024-01-20", time: "Est. 5:00 PM", completed: false },
        ],
      }
      setOrderData(mockOrderData)
      setIsLoading(false)
    }, 1000)
  }, [orderId, email])

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        sender: "customer",
        message: chatMessage,
        timestamp: new Date().toLocaleString(),
        senderName: "You",
      }
      setChatMessages([...chatMessages, newMessage])
      setChatMessage("")

      // Simulate store response
      setTimeout(() => {
        const storeResponse = {
          id: chatMessages.length + 2,
          sender: "store",
          message: "Thanks for your message! We'll look into this and get back to you shortly.",
          timestamp: new Date().toLocaleString(),
          senderName: "TechHub Support",
        }
        setChatMessages((prev) => [...prev, storeResponse])
      }, 2000)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-500 text-white"
      case "in transit":
        return "bg-blue-500 text-white"
      case "processing":
        return "bg-yellow-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <Package className="w-12 h-12 mx-auto text-muted-foreground" />
            <h2 className="text-xl font-semibold">Order Not Found</h2>
            <p className="text-muted-foreground">We couldn&lsquo;t find an order with the provided details.</p>
            <Button onClick={() => router.push("/public-dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.push("/public-dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Order #{orderData.id}</h1>
              <p className="text-sm text-muted-foreground">
                Placed on{" "}
                {new Date(orderData.orderDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(orderData.status)} variant="secondary">
            {orderData.status}
          </Badge>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tracking">Tracking</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Store Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Store Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={orderData.store.logo || "/placeholder.svg"} alt={orderData.store.name} />
                      <AvatarFallback>{orderData.store.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">{orderData.store.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="w-3 h-3 fill-current text-yellow-500" />
                        <span>{orderData.store.rating}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        <span>Responds in {orderData.store.responseTime}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{orderData.contact.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{orderData.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{orderData.contact.email}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Order Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {orderData.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <h5 className="font-medium">{item.name}</h5>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <span className="font-semibold">${item.price.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-2xl">${orderData.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
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
                    {orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.zip}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tracking Tab */}
          <TabsContent value="tracking" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Order Tracking
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Tracking Number: <span className="font-mono font-medium">{orderData.trackingNumber}</span>
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Estimated Delivery */}
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Estimated Delivery</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(orderData.estimatedDelivery).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-4">
                    {orderData.timeline.map((step: any, index: number) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              step.completed ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {step.completed ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                          </div>
                          {index < orderData.timeline.length - 1 && (
                            <div className={`w-0.5 h-12 ${step.completed ? "bg-green-500" : "bg-muted"}`} />
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <h4 className={`font-medium ${step.completed ? "text-foreground" : "text-muted-foreground"}`}>
                            {step.status}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {step.date} • {step.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6 mt-6">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle>Chat with Store</CardTitle>
                <p className="text-sm text-muted-foreground">Get instant support from {orderData.store.name}</p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "customer" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.sender === "customer" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.sender === "customer" ? "text-primary-foreground/70" : "text-muted-foreground"
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
                      className="flex-1 min-h-[60px] max-h-[120px] resize-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline" className="h-10 w-10 p-0 bg-transparent">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
