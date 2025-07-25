/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import { Coins } from "lucide-react";
import ContainerDashboard from "../_components/container-dashboard";
import { ArrowDiv, GraphGoesHere, Pill } from "../_components/small-comps";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ProductModal } from "../_components/modals/product-modal";
import { useFetchUserProducts } from "@/app/(handlers)/product/product";

const Page = () => {
  const { data } = useFetchUserProducts();
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  });
  const [showModal, setShowModal] = useState(true);

  return (
    <>
      <div className=" flex bg-primary flex-col gap-5">
        <div className="grid grid-cols-5 gap-5">
          <div className="  col-span-3">
            {" "}
            <ContainerDashboard>
              <div className=" w-full flex flex-col gap-6 justify-between h-full">
                <div className="flex  items-center justify-between">
                  <h1 className="headerText">Total Sales</h1>
                  <Select>
                    <SelectTrigger className="w-[120px] text-xs font-medium">
                      <SelectValue placeholder="Last 7 Days" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="headerText-l  ">$1239</p>
                  <p className="light_mid ">Your sales has gone up 🎉</p>
                </div>

                <div className="grid grid-cols-3 gap-5">
                  <Pill
                    upperText="In Store Sales"
                    valueDirection={20}
                    value={5003}
                  />
                  <Pill
                    upperText="In Store Sales"
                    valueDirection={20}
                    value={5003}
                  />
                  <Pill
                    upperText="In Store Sales"
                    valueDirection={20}
                    value={5003}
                  />
                </div>
              </div>
            </ContainerDashboard>
          </div>
          <div className="  col-span-2">
            {" "}
            <ContainerDashboard>
              <div className=" w-full h-full flex flex-col">
                <div className="flex mb-2 justify-between">
                  <h1 className="headerText">Total Orders</h1>
                  <Coins />
                </div>
                <div className=" flex items-center gap-1">
                  <p className="headerText-l">350</p>
                  <ArrowDiv value={-20} />
                </div>
                <p className="light_mid mt-1 mb-3">
                  Your order surged by 20% this month
                </p>
                <GraphGoesHere />
              </div>
            </ContainerDashboard>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-5">
          <div className="  col-span-2">
            {" "}
            <ContainerDashboard>
              <div className=" w-full h-full flex flex-col">
                <div className="flex mb-2 justify-between">
                  <h1 className="headerText">Invoice Statistics</h1>
                  <Select>
                    <SelectTrigger className="w-[120px] text-xs font-medium">
                      <SelectValue placeholder="Last 7 Days" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <GraphGoesHere />
              </div>
            </ContainerDashboard>
          </div>
          <div className="  col-span-3">
            {" "}
            <ContainerDashboard>
              <div className=" w-full flex flex-col gap-6 justify-between h-full">
                <div className="flex  items-center justify-between">
                  <h1 className="headerText">Product Sales</h1>
                  <div className={cn("grid gap-2")}>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant={"outline"}
                          className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon />
                          {date?.from ? (
                            date.to ? (
                              <>
                                {format(date.from, "LLL dd, y")} -{" "}
                                {format(date.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(date.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={date?.from}
                          selected={date}
                          onSelect={setDate}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="headerText-l  ">$1239</p>
                  <p className="light_mid ">Your sales has gone up 🎉</p>
                </div>

                <div className="grid grid-cols-3 gap-5">
                  <Pill
                    upperText="In Store Sales"
                    valueDirection={20}
                    value={5003}
                  />
                  <Pill
                    upperText="In Store Sales"
                    valueDirection={20}
                    value={5003}
                  />
                  <Pill
                    upperText="In Store Sales"
                    valueDirection={20}
                    value={5003}
                  />
                </div>
              </div>
            </ContainerDashboard>
          </div>
        </div>
      </div>
      {data?.length === 0 && (
        <ProductModal setShowModal={setShowModal} showModal={showModal} />
      )}
    </>
  );
};

export default Page;
