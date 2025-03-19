/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Button } from "./button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { ChevronDown, X } from "lucide-react";
import clsx from "clsx";

const Faq = () => {
  const faqData = [
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship worldwide."
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept credit/debit cards, PayPal, and other secure payment options."
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order is shipped, you will receive a tracking number via email."
    },
    {
      question: "What is your return policy?",
      answer:
        "You can return items within 30 days of delivery for a full refund or exchange."
    },
    {
      question: "How long does shipping take?",
      answer:
        "Shipping times vary by location. Standard shipping takes 5-7 business days, while express shipping takes 2-3 business days."
    }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index: any) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className=" flex sm:flex-col gap-10 lg:flex-row flex-col p-4 sm:p-10 justify-between">
      <div className="flex flex-col justify-center lg:items-start lg:justify-start items-center">
        <p className="text-4xl text-center lg:text-left">
          Frequently Asked Questions
        </p>

        <p className="my-4 text-center lg:text-left max-w-[500px]">
          Couldn’t find the answer you need? You can check out our list of
          helpful information here or contact our support team at
          customer@Hubsell.com
        </p>

        <Sheet>
          <SheetTrigger asChild>
            <Button className="!bg-[#210124] text-white" text="Contact Us" />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Are you absolutely sure?</SheetTitle>
              <SheetDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <div>
        <div className="space-y-2 w-full lg:w-[600px]">
          {faqData.map((item, index) => (
            <div key={index} className=" overflow-hidden rounded-lg">
              <button
                className="w-full cursor-pointer items-center flex justify-between text-left p-5 bg-[#F4F4F9] text-black focus:outline-none"
                onClick={() => toggleAccordion(index)}
              >
                {item.question}
                {openIndex === index ? (
                  <X size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>

              <div
                className={clsx(
                  " transition-all duration-300 bg-[#F4F4F9] ",
                  openIndex === index
                    ? " h-fit opacity-100 px-5 pt-1 pb-4"
                    : " opacity-0 h-0  px-0 pt-0 pb-0"
                )}
              >
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
