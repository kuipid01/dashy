"use client";
import Image from "next/image";
import { Button } from "./button";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import clsx from "clsx";
import { useState, useEffect } from "react";

export const Landing = () => {
  const steps = [
    {
      step: 1,
      title: "Sign Up",
      description: "Create an account using your email and set up your password.",
    },
    {
      step: 2,
      title: "Set Up Your Store",
      description: "Enter your store name, logo, and basic details to personalize your shop.",
    },
    {
      step: 3,
      title: "Add Products",
      description: "Upload product images, set prices, and add descriptions for your items.",
    },
    {
      step: 4,
      title: "Manage Inventory",
      description: "Keep track of stock levels and update product availability as needed.",
    },
    {
      step: 5,
      title: "Start Selling",
      description: "Launch your store and start receiving orders from customers.",
    }
  ];
  const [currentStep, setCurrentStep] = useState(0);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => prev + 1 > steps.length - 1 ? 0 : prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, [currentStep]);
  return (
    <div className=" h-fit  pt-[200px]  flex flex-col justify-center items-center bg-primary w-full">
      <h1 className="text-3xl md:text-4xl lg:text-5xl max-w-[97%] lg:max-w-[800px] leading-[1.2] text-center">Launch Your <span className="hidden lg:block">Online, </span>  Business in Seconds. <span className="hidden lg:block">Manage, </span> and Sell Anything, Instantly. </h1>
      <p className="text-lg max-w-[90%] lg:max-w-[800px] my-4 text-center">Launch your global online store instantly and sell anything. HubSell simplifies e-commerce.</p>

      <div className="flex  flex-col lg:flex-row gap-5">
        <Button text="See Pricing" icon={<ArrowRight size={18} color="white" />} className="!bg-black w-[200px] lg:w-auto !text-white" />
        <Button text="Get Started" className="w-[200px] justify-center lg:w-auto" />
      </div>
      <div className=" w-[90%]  lg:w-[80%] p-5  z-10 mt-20 bg-[#E7E3D6] overflow-hidden flex flex-col lg:flex-row items-start gap-10 h-[800px]  lg:h-[500px] rounded-[60px] border border-black border-dashed">
        <div className="lg:w-1/2 w-full h-[50%] lg:h-full relative rounded-3xl lg:rounded-[60px] overflow-hidden">
          <Image fill src="/assets/bg1.jpg" alt="" />
        </div>
        <div className="flex  relative flex-col w-[450px] h-[50%] overflow-hidden lg:h-full ">
          <div>
            {steps.map((step) => (
              <motion.div
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: -(currentStep * 60) + "vh" }}
                transition={{ duration: .8, delay: 0.1, ease: "easeInOut" }}
                key={step.step} className="flex flex-col p-5 h-[60vh]  items-start gap-4">
                <div className={clsx(`w-10 h-10 text-black font-medium  rounded-full flex items-center justify-center`, step.step % 2 === 0 ? "bg-accent" : "bg-secondary")}>
                  <p className="text-black">{step.step}</p>
                </div>
                <div>
                  <h3 className="font-bold text-[30px]">{step.title}</h3>
                  <p className="text-[24px] font-medium text-zinc-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
};
