import Image from "next/image";
import React from "react";
import { Button } from "./button";

const About = () => {
  return (
    <div className=" p-4 sm:p-10">
      <div className=" w-full pb-10 bg-black h-[60vh] sm:h-[80vh] flex items-end px-4 sm:px-10 rounded-lg  overflow-hidden">
        <Image fill alt="about -image" src="" />

        <div className=" flex text-white items-start flex-col">
          <p className=" text-[25px]">Discover Dashy</p>
          <p className=" w-full text-xs sm:text-lg sm:max-w-[500px] my-2">
            At Dashy, we do more than just sell fashion—we curate and sometimes
            create pieces that let you express your individuality. Our
            collections are designed for those who dare to stand out and
            showcase their true selves.
          </p>
          <Button className="" text="About Us" />
        </div>
      </div>
    </div>
  );
};

export default About;
