import { Button } from "./button";
import { ArrowRight } from "lucide-react";

export const Landing = () => {
  // return (
  //   <div className="h-[80vh] lg:h-[100vh] overflow-hidden  flex flex-col justify-end items-start w-full">
  //     <div className=" absolute w-full h-screen">
  //       <Image
  //         className=" absolute object-cover object-center"
  //         fill
  //         alt="Model For Landing Page"
  //         src="/assets/bg1.jpg"
  //       />
  //       <div className=" absolute top-0 left-0 bottom-0 w-full h-screen bg-black/20"></div>
  //     </div>

  //     <div className="flex px-4 sm:px-10 pb-10 gap-2  text-white relative flex-col">
  //       <p className=" text-5xl lg:text-2xl sm:max-w-[700px] w-full uppercase sm:capitalize font-medium lg:font-bold ">
  //         {" "}
  //         Redefining Limits, One Look at a Time.
  //       </p>

  //       <p className="sm:text-lg max-w-[70%] text-[14px]">
  //         More than fashion—it&apos;s a fearless statement of style.
  //       </p>

  //       <div className="flex items-center gap-3">
  //         <Button text="Shop Now" />

  //         <button className=" border-b-2 border-white">Start Selling</button>
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <div className="h-[130vh]  flex flex-col justify-center items-center bg-primary w-full">
      <h1 className="text-5xl max-w-[800px] leading-[1.2] text-center">Launch Your Online Business in Seconds. Manage, and Sell Anything, Instantly. </h1>
      <p className="text-lg max-w-[800px] my-4 text-center">Effortlessly create your online store and sell your products whatever they may be  to a global audience, all within seconds. Revolutionize your e-commerce journey with HubSell's intuitive platform.</p>

      <div className="flex gap-5">
        <Button text="See Pricing" icon={<ArrowRight size={18} color="white"/>} className="!bg-black !text-white" />
        <Button text="Get Started"  />
      </div>

    </div>
  )
};
