"use client";
import Image from "next/image";
import { Button } from "./button";

import { useState, useEffect } from "react";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

export const Landing = () => {
  const router = useRouter();
  const steps = [
    {
      step: 1,
      title: "Sign Up",
      description:
        "Create an account using your email and set up your password."
    },
    {
      step: 2,
      title: "Set Up Your Store",
      description:
        "Enter your store name, logo, and basic details to personalize your shop."
    },
    {
      step: 3,
      title: "Add Products",
      description:
        "Upload product images, set prices, and add descriptions for your items."
    },
    {
      step: 4,
      title: "Manage Inventory",
      description:
        "Keep track of stock levels and update product availability as needed."
    },
    {
      step: 5,
      title: "Start Selling",
      description:
        "Launch your store and start receiving orders from customers."
    }
  ];
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1 > steps.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, [currentStep, steps.length]);
  return (
    <div className=" h-fit pt-[100px]  flex flex-col justify-center items-center bg-primary w-full">
      <div className="h-screen w-full flex md:flex-row flex-col-reverse md:gap-10">
        <div className=" h-[70vh] md:h-screen md:rounded-r-[30px] overflow-hidden relative w-full md:w-1/2 ">
          <Image
            alt="landing-pageimage"
            src="/land.png"
            fill
            className="object-cover"
          />
        </div>

        <div className=" h-[70vh] md:h-screen md:pl-10 flex flex-col justify-center relative w-full md:w-1/2 ">
          <h1 className="text-3xl font-black w-full md:max-w-[70%] md:text-4xl lg:text-[45px]  lg:w-auto  leading-[1.3] text-center md:text-left">
            Launch Your <span className="hidden lg:inline-block">Online, </span>{" "}
            Business in Seconds.{" "}
            <span className="hidden lg:inline-block">Manage, </span> and Sell
            Anything, Instantly.{" "}
          </h1>
          <p className="text-2xl w-full md:max-w-[70%] lg:max-w-[80%] my-4 text-center md:text-left">
            Launch your global online store instantly and sell anything. HubSell
            simplifies e-commerce.
          </p>

          <div className="flex items-center  flex-col gap-3 lg:flex-row md:gap-5">
            {/* <Button
              text="See Pricing"
              icon={<ArrowRight size={18} color="white" />}
              className="!bg-black w-[200px] lg:w-auto !text-white"
            /> */}
            <Button
              onClick={() => router.push("/login")}
              iconPlace="left"
              icon={<LogIn />}
              text="Back In "
              className="w-[200px] cursor-pointer  font-bold !px-12 py-4 justify-center lg:w-auto"
            />
            <Button
              onClick={() => router.push("/signup")}
              text="Get Started"
              className="w-[200px] cursor-pointer !bg-[#F4D58D] font-bold !px-12 py-4 justify-center lg:w-auto"
            />
          </div>
        </div>
      </div>

      {/* <div className=" w-[90%]  lg:w-[80%] p-5  z-10 mt-20 bg-[#E7E3D6] overflow-hidden flex flex-col lg:flex-row items-start gap-10 h-[800px]  lg:h-[500px] rounded-[60px] border border-black border-dashed">
        <div className="lg:w-1/2 w-full h-[50%] lg:h-full relative rounded-3xl lg:rounded-[60px] overflow-hidden">
          <Image fill src="/assets/bg1.jpg" alt="" />
        </div>
        <div className="flex  relative flex-col w-[450px] h-[50%] overflow-hidden lg:h-full ">
          <div>
            {steps.map((step) => (
              <motion.div
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: -(currentStep * 60) + "vh" }}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeInOut" }}
                key={step.step}
                className="flex flex-col p-5 h-[60vh]  items-start gap-4"
              >
                <div
                  className={clsx(
                    `w-10 h-10 text-black font-medium  rounded-full flex items-center justify-center`,
                    step.step % 2 === 0 ? "bg-accent" : "bg-secondary"
                  )}
                >
                  <p className="text-black">{step.step}</p>
                </div>
                <div>
                  <h3 className="font-bold text-[30px]">{step.title}</h3>
                  <p className="text-[24px] font-medium text-zinc-600">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
};
