import Image from "next/image";
import React from "react";

const Testimonial = () => {
  return (
    <div className="min-h-screen bg-primary pb-[100px] border-b border-black border-dashed flex flex-col items-center justify-center">
      <h1 className="text-center w-full lg:max-w-[80%] mb-10 mx-auto text-[26px] md:text-[36px] lg:text-[46px] text-black font-semibold">
        Trusted By Individuals & Brands
      </h1>
      <div className="bg-white flex flex-col lg:flex-row overflow-hidden w-[90%] lg:w-[80%] mx-auto rounded-[10px]">
        <div className="w-full lg:w-[40%] h-[300px] lg:h-[600px] relative">
          <Image
            className="object-cover"
            alt="Stephen Adegoke"
            src="/assets/login.jpg"
            fill
          />
        </div>
        <div className="flex-1 relative p-10 text-black flex-col flex">
          <p className="font-bold text-xl">Stephen Adegoke</p>
          <p className="text-lg text-gray-700">CEO, TrackHub-NG</p>
          <p className="mt-3 md:mt-4 text-md md:text-lg italic text-gray-800">
          &ldquo;This platform transformed our business. Initially, we faced
            inefficiencies that slowed our growth, but once we integrated this
            system, everything changed. The intuitive interface and automation
            made operations seamless.
            <span className="hidden md:inline">
              <br />
              <br />
              What truly sets them apart is their exceptional support. Whenever
              we needed help, their team was there, going above and beyond. It&quot;s
              rare to find a company that genuinely cares, and that personal
              touch made all the difference.
              <br />
              <br />
              Thanks to this solution, we&quot;ve streamlined processes, increased
              revenue, and improved customer satisfaction. I highly recommend it
              to anyone looking to scale confidently.&ldquo;
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
