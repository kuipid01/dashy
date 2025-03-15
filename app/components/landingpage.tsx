import Image from "next/image";
import { Button } from "./button";

export const Landing = () => {
  return (
    <div className="h-[80vh] lg:h-[100vh] overflow-hidden  flex flex-col justify-end items-start w-full">
      <div className=" absolute w-full h-screen">
        <Image
          className=" absolute object-cover object-center"
          fill
          alt="Model For Landing Page"
          src="/assets/bg1.jpg"
        />
        <div className=" absolute top-0 left-0 bottom-0 w-full h-screen bg-black/20"></div>
      </div>

      <div className="flex px-4 sm:px-10 pb-10 gap-2  text-white relative flex-col">
        <p className=" text-5xl lg:text-2xl sm:max-w-[700px] w-full uppercase sm:capitalize font-medium lg:font-bold ">
          {" "}
          Redefining Limits, One Look at a Time.
        </p>

        <p className="sm:text-lg max-w-[70%] text-[14px]">
          More than fashion—it&apos;s a fearless statement of style.
        </p>

        <div className="flex items-center gap-3">
          <Button text="Shop Now" />

          <button className=" border-b-2 border-white">Start Selling</button>
        </div>
      </div>
    </div>
  );
};
