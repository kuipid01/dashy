import Image from "next/image";
import { Button } from "./button";

export const CTA = () => {
  return (
    <div className=" bg-[#E7E3D6] h-[80vh] lg:h-screen flex flex-col items-center justify-center">
      <div className="w-[95%] flex justify-center items-center flex-col relative overflow-hidden mx-auto h-[50vh] md:h-[60vh] lg:h-[70vh] bg-[#F4D58D] p-10 rounded-[30px]">
        <Image
          src="/assets/dashed.svg"
          alt=""
          width={500}
          height={500}
          className="w-[300px] lg:w-[500px] h-[300px] lg:h-[500px] absolute object-contain right-[-50px] top-[-80px]"
        />
        <Image
          src="/assets/dashed.svg"
          alt=""
          width={300}
          height={300}
          className="w-[300px] h-[300px] absolute object-contain left-[-150px] lg:left-[-50px] bottom-[-80px]"
        />

        <h1 className="text-black max-w-[700px] mb-5 text-center font-semibold lg:font-bold text-[26px] md:text-[36px] lg:text-[46px]">
          Unlock Your Store&apos;s Full Potential with Ease
        </h1>
        <p className="text-center text-lg text-gray-800 max-w-[600px] mb-8">
          Elevate your eCommerce game with a store designed for seamless sales, automation, and brand growth—no hassle, just results.
        </p>
        <div className="flex flex-col lg:flex-row gap-5">
          <Button
            text="Start Free Trial"
            className="justify-center w-[250px] h-[50px]"
          />
        </div>
      </div>
    </div>
  );
};
