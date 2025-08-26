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
  SelectValue
} from "@/components/ui/select";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ProductModal } from "../_components/modals/product-modal";
import { useFetchUserProducts } from "@/app/(handlers)/product/product";
import { OnboardingFlow } from "./comps_personal/onboarding-flow";
import { useFetchUser } from "@/app/(handlers)/auth-handlers/auth";

const Page = () => {
  const { data } = useFetchUserProducts();
  const { user } = useFetchUser();
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20)
  });
  const [showModal, setShowModal] = useState(true);

  return (
    <>
      {!user?.hasCompletedOnboarding && <OnboardingFlow />}
      <div className="flex bg-primary flex-col gap-5 p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-5">
          <div className="lg:col-span-3 col-span-1">
            <ContainerDashboard>
              <div className="w-full flex flex-col gap-6 justify-between h-full transition-all duration-300 hover:shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h1 className="headerText text-xl sm:text-2xl">
                    Total Sales
                  </h1>
                  <Select>
                    <SelectTrigger className="w-full sm:w-[140px] text-xs font-medium transition-all duration-200 hover:scale-105">
                      <SelectValue placeholder="Last 7 Days" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-2 duration-500">
                  <p className="headerText-l text-3xl sm:text-4xl transition-all duration-300 hover:scale-105">
                    $1239
                  </p>
                  <p className="light_mid text-sm sm:text-base">
                    Your sales has gone up 🎉
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">
                  <div className="animate-in slide-in-from-left-2 duration-500 delay-100">
                    <Pill
                      upperText="In Store Sales"
                      valueDirection={20}
                      value={5003}
                    />
                  </div>
                  <div className="animate-in slide-in-from-left-2 duration-500 delay-200">
                    <Pill
                      upperText="Online Sales"
                      valueDirection={15}
                      value={3200}
                    />
                  </div>
                  <div className="animate-in slide-in-from-left-2 duration-500 delay-300">
                    <Pill upperText="Returns" valueDirection={-5} value={180} />
                  </div>
                </div>
              </div>
            </ContainerDashboard>
          </div>
          <div className="lg:col-span-2 col-span-1">
            <ContainerDashboard>
              <div className="w-full h-full flex flex-col transition-all duration-300 hover:shadow-lg">
                <div className="flex mb-2 justify-between items-center">
                  <h1 className="headerText text-xl sm:text-2xl">
                    Total Orders
                  </h1>
                  <Coins className="w-6 h-6 text-yellow-500 transition-all duration-300 hover:scale-110 hover:rotate-12" />
                </div>
                <div className="flex items-center gap-1 animate-in slide-in-from-bottom-2 duration-500 delay-200">
                  <p className="headerText-l text-3xl sm:text-4xl transition-all duration-300 hover:scale-105">
                    350
                  </p>
                  <ArrowDiv value={-20} />
                </div>
                <p className="light_mid mt-1 mb-3 text-sm sm:text-base">
                  Your order surged by 20% this month
                </p>
                <div className="animate-in slide-in-from-bottom-2 duration-500 delay-300">
                  <GraphGoesHere />
                </div>
              </div>
            </ContainerDashboard>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-5">
          <div className="lg:col-span-2 col-span-1">
            <ContainerDashboard>
              <div className="w-full h-full flex flex-col transition-all duration-300 hover:shadow-lg">
                <div className="flex mb-2 justify-between items-center">
                  <h1 className="headerText text-xl sm:text-2xl">
                    Invoice Statistics
                  </h1>
                  <Select>
                    <SelectTrigger className="w-full sm:w-[140px] text-xs font-medium transition-all duration-200 hover:scale-105">
                      <SelectValue placeholder="Last 7 Days" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="animate-in slide-in-from-left-2 duration-500 delay-400">
                  <GraphGoesHere />
                </div>
              </div>
            </ContainerDashboard>
          </div>
          <div className="lg:col-span-3 col-span-1">
            <ContainerDashboard>
              <div className="w-full flex flex-col gap-6 justify-between h-full transition-all duration-300 hover:shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h1 className="headerText text-xl sm:text-2xl">
                    Product Sales
                  </h1>
                  <div className={cn("grid gap-2")}>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant={"outline"}
                          className={cn(
                            "w-full sm:w-[300px] justify-start text-left font-normal transition-all duration-200 hover:scale-105 hover:shadow-md",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="w-4 h-4 mr-2" />
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
                <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-2 duration-500 delay-500">
                  <p className="headerText-l text-3xl sm:text-4xl transition-all duration-300 hover:scale-105">
                    $1239
                  </p>
                  <p className="light_mid text-sm sm:text-base">
                    Your sales has gone up 🎉
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">
                  <div className="animate-in slide-in-from-left-2 duration-500 delay-600">
                    <Pill
                      upperText="Top Product"
                      valueDirection={25}
                      value={8900}
                    />
                  </div>
                  <div className="animate-in slide-in-from-left-2 duration-500 delay-700">
                    <Pill
                      upperText="New Products"
                      valueDirection={12}
                      value={2100}
                    />
                  </div>
                  <div className="animate-in slide-in-from-left-2 duration-500 delay-800">
                    <Pill
                      upperText="Seasonal"
                      valueDirection={8}
                      value={1500}
                    />
                  </div>
                </div>
              </div>
            </ContainerDashboard>
          </div>
        </div>
      </div>
      {data?.length === 0 && user?.hasCompletedOnboarding && (
        <ProductModal setShowModal={setShowModal} showModal={showModal} />
      )}
    </>
  );
};

export default Page;
