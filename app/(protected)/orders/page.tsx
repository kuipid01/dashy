import { MockOrders } from "@/constants/mock_data";
import { Order } from "@/constants/types";

import React from "react";
import OrderCard from "../_components/order-card";

const Page = () => {
  return (
    <div className=" flex flex-col gap-5 p-5 rounded-xl min-h-screen h-full w-full">
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 ">
        {MockOrders.map((order: Order) => (
          <OrderCard key={order.orderId} order={order} />
        ))}
      </div>
    </div>
  );
};

export default Page;
