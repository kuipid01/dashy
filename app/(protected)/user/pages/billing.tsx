"use client"
import { CreditCard } from "lucide-react";
import React from "react";
import { Subcard } from "./_comps/sub-card";

const Billing = () => {
  const mockOrders = [
    {
      id: 1,
      orderNumber: "ORD123456",
      date: "2023-08-15",
      type: "Payment",
      amount: 150.0,
    },
    {
      id: 2,
      orderNumber: "ORD123457",
      date: "2023-08-14",
      type: "Ad Integration",
      amount: 250.0,
    },
    {
      id: 3,
      orderNumber: "ORD123458",
      date: "2023-08-13",
      type: "Provisioning",
      amount: 120.0,
    },
  ];

  const mockPaymentMethods = [
    {
      id: 1,
      cardType: "Credit Card",
      cardNumber: "1234 5678 9012 3456",
      expiryDate: "09/25",
      cvv: "123",
    },
    {
      id: 2,
      cardType: "Bank Account",
      accountNumber: "1234 5678 9012 3456",
      bankName: "Access Bank",
    },
  ];
  return (
    <div className="pb-20 pt-10 md:max-w-4xl w-full overflow-x-hidden mx-auto">
      <div className="p-6 border rounded-lg border-gray-300 shadow-lg bg-white">
        <div>
          <h2 className="text-2xl font-semibold">Billing</h2>
        </div>

        <h2 className="text-lg mt-10 font-semibold ">Order History</h2>
        <p className="text-gray-500">
          Manage your billing information and view your order history
        </p>
        <div className="mt-5 justify-between flex md:flex-row flex-col gap-10">
          <div className=" max-w-full md:w-auto overflow-x-auto ">
            <table>
              <thead>
                <tr className="">
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Order Type</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-2">{order.date}</td>
                    <td className="px-4 py-2">{order.type}</td>
                    <td className="px-4 py-2">{order.amount}</td>
                    <td className="px-4 py-2">
                      {" "}
                      <button className="border rounded-md px-2 py-1">
                        Download
                      </button>{" "}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="border mt-4 rounded-md px-2 py-1">
              Load More
            </button>
          </div>
          <Subcard planType="Pro" />
        </div>

        <div className=" mt-10">
          <h2 className="text-lg font-semibold">Payment Methods</h2>
          <p className="text-gray-500">Manage your payment methods</p>
          <div className="mt-5 flex flex-col gap-4 w-full md:max-w-[60%]">
            {mockPaymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex justify-between items-center border rounded-md p-5"
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-6 h-6" />
                  <h3 className="font-semibold">{method.cardType}</h3>
                </div>
                <button className=" bg-black text-white rounded-md px-4 py-2">
                  Remove
                </button>
              </div>
            ))}
            <button className="border mt-4 rounded-md px-4 py-2 bg-black text-white">
              Add Payment Method
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
