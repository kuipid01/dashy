/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Order } from "@/constants/types";
import {
  Download,
  Printer,
  FileText,
  Calendar,
  MapPin,
  Phone,
  Mail,
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
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

interface InvoiceGeneratorProps {
  order: Order;
  children?: React.ReactNode;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function InvoiceGenerator({
  order,
  children,
  isOpen,
  setIsOpen
}: InvoiceGeneratorProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: `Invoice-${order.id}`
  });

  const handleDownload = () => {
    if (invoiceRef.current) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Invoice ${order.id}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                .invoice-container { max-width: 800px; margin: 0 auto; }
                ${invoiceRef.current.innerHTML}
              </style>
            </head>
            <body>
              <div class="invoice-container">
                ${invoiceRef.current.innerHTML}
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN"
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[800px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Invoice #{order.id}
        </DialogTitle>

        <div className="space-y-4">
          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pb-4 border-b">
            <Button
              variant="outline"
              onClick={handlePrint}
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button
              disabled={true}
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>

          {/* Invoice Content */}
          <div ref={invoiceRef} className="bg-white p-8 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start border-b pb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
                <p className="text-gray-600 mt-2">Invoice #{order.id}</p>
                <p className="text-gray-600">
                  Date:{" "}
                  {formatDate(order.placedAt || order.placed_at || new Date())}
                </p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-semibold text-gray-900">DashBuy</h2>
                <p className="text-gray-600">Your Trusted Marketplace</p>
                <p className="text-gray-600">Nigeria</p>
              </div>
            </div>

            {/* Bill To Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Bill To:
                </h3>
                <div className="space-y-1 text-gray-700">
                  <p className="font-medium">
                    {order.contact?.FirstName || order.contact?.name || "N/A"}{" "}
                    {order.contact?.LastName || ""}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {order.contact?.Phone || order.contact?.phone || "N/A"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {order.contact?.Email || order.contact?.email || "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Ship To:
                </h3>
                <div className="space-y-1 text-gray-700">
                  <p className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    <span>
                      {order.address?.Street || order.address?.street || "N/A"},{" "}
                      {order.address?.City || order.address?.city || "N/A"},{" "}
                      {order.address?.State || order.address?.state || "N/A"}
                    </span>
                  </p>
                  <p className="ml-6">
                    {order.address?.Country ||
                      order.address?.country ||
                      "Nigeria"}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items Table */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Items:
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">
                        Item
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-900">
                        Qty
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-right font-medium text-gray-900">
                        Unit Price
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-right font-medium text-gray-900">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems?.map((item, index) => (
                      <tr key={item.orderID || item.productID || index}>
                        <td className="border border-gray-300 px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.Product?.Name ||
                                item.Product?.name ||
                                item.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.Product?.Category ||
                                item.Product?.category ||
                                "Category"}
                            </p>
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          {item.Quantity || item.quantity || 1}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-right">
                          {formatCurrency(item.UnitPrice || item.price || 0)}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-right font-medium">
                          {formatCurrency(item.TotalPrice || item.price || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary */}
            <div className="flex justify-end">
              <div className="w-80 space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="font-medium">
                    {formatCurrency(order.total || 0)}
                  </span>
                </div>
                {/* <div className="flex justify-between py-2 border-b text-gray-600">
                  <span>Commission:</span>
                  <span>{formatCurrency(order.commision || 0)}</span>
                </div> */}
                <div className="flex justify-between py-2 border-b text-gray-600">
                  <span>Delivery:</span>
                  <span>
                    {formatCurrency(order.deliveryOption?.price || 0)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b text-gray-600">
                  <span>Tax:</span>
                  <span>{formatCurrency(0)}</span>
                </div>
                <div className="flex justify-between py-3 text-lg font-semibold bg-gray-50 px-4 rounded">
                  <span>Total:</span>
                  <span>{formatCurrency(order.total || 0)}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Payment Information:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-700">
                    <strong>Payment Status:</strong>{" "}
                    {order.payment?.status === "completed" ? "Paid" : "Pending"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Payment Method:</strong>{" "}
                    {order.payment?.id ? "Online Payment" : "Cash on Delivery"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-700">
                    <strong>Delivery Mode:</strong>{" "}
                    {order.deliveryMode || "Standard"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Order Status:</strong>{" "}
                    <span className="capitalize">{order.status}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-6 text-center text-gray-600">
              <p className="text-sm">
                Thank you for your business! For any questions about this
                invoice, please contact us.
              </p>
              <p className="text-xs mt-2">
                This invoice was generated on {formatDate(new Date())}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
