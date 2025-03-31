import Image from "next/image";
import { Pill } from "./pill";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
export const Use1 = () => {
  const features = [
    {
      step: "01",
      title: "Launch Your Store Instantly",
      description:
        "Create your ecommerce website and add your first product in minutes.",
      showArrow: true,
    },
    {
      step: "02",
      title: "Effortless Setup & Customization",
      description:
        "Customize your store with ease, using our intuitive tools and templates.",
      showArrow: true,
    },
    {
      step: "03",
      title: "Start Selling Today",
      description:
        "Begin accepting orders and growing your business right away.",
      showArrow: false,
    },
  ];
  return (
    <div className="h-fit min-h-screen pt-[100px] md:pt-[150px] bg-primary flex flex-col w-full ">
      <p className="text-center w-full lg:max-w-[80%] mx-auto text-[26px] md:text-[36px] lg:text-[46px] font-semibold">
        HubSell Takes Care of the Essentials, So You Can Focus on Growth
      </p>
      <div className=" h-[90vh] lg:h-screen pt-[100px] lg:pt-0 flex flex-col relative overflow-y-clip justify-center items-center">
        <Image
          src="/assets/use-mountain.svg"
          alt=""
          width={3440}
          height={778}
          className="absolute z-0 bottom-0 left-0 right-0 object-cover"
        />

        <div className=" border-b relative flex-col-reverse lg:flex-row mb-4 flex-1 w-[80%] mx-auto border-dashed border-black flex items-center justify-between">
          <div className=" relative md:w-1/2 w-full">
            <Image
              src="/assets/use1.jpg"
              alt=""
              width={500}
              height={778}
              className=" z-0 bottom-0 left-0 right-0 object-cover"
            />
          </div>
          <div className="  flex flex-col items-center lg:items-start w-full md:w-1/2">
            <Pill text="QUICK AD INTEGRATION" />

            <h1 className=" text-black text-center lg:text-left text-[26px] md:text-[36px] lg:text-[46px] leading-[1.2] my-4">
              One-Click Setup – Launch Your Store Instantly
            </h1>
            <p className="mt-2 leading-[1.5] text-[15px] md:text-[20px] text-center lg:text-left lg:text-[20px] text-black">
              Get your online store up and running in minutes—no technical
              skills needed. Our streamlined setup process lets you pick a name,
              customize your storefront, and start selling right away.
            </p>
            <Button className="mt-4 px-7 py-3 bg-black text-white">
              <span>Sign Up</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-[#E7E3D6] py-[100px]">
        <div className="  flex flex-col items-center justify-center w-[90%] mx-auto">
          <Pill text="3-step Process" />

          <h1 className=" text-black text-[26px] md:text-[36px] lg:text-[46px] lg:max-w-[60%] text-center lg:text-left leading-[1.2] mt-4">
            Launch Your Store Instantly and Start Converting Customers
            Effortlessly.
          </h1>

          <div className=" flex flex-col lg:flex-row gap-3 mt-7">
            {features.map((feature) => (
              <div
                key={feature.step}
                className="relative lg:first:rounded-l-[40px] rounded-2xl p-10 lg:last:rounded-r-[40px] bg-white flex flex-row items-start justify-start"
              >
                <div className=" mr-5">
                  <p className=" text-[30px] text-accent font-medium">
                    {feature.step}
                  </p>
                </div>
                <div className=" flex flex-col border-l border-dashed border-black pl-5">
                  <h3 className="font-medium text-[15px] text-zinc-500 uppercase">
                    {feature.title}
                  </h3>
                  <p className="leading-[1.5] font-medium mt-10 text-[20px] text-black">
                    {feature.description}
                  </p>
                </div>

                {feature.showArrow && (
                  <div className="bg-primary z-10 lg:top-1/2 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:-translate-y-1/2 bottom-[-40px] lg:right-[-40px] lg:bottom-auto shrink-0 absolute  size-[60px]  rounded-full  grid place-items-center">
                    <div className=" bg-white size-[45px] rounded-full grid place-items-center">
                      <ArrowRight className=" hidden lg:block text-black" />
                      <ArrowDown className=" lg:hidden text-black" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
