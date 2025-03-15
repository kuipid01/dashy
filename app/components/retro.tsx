"use client";
import React, { useState } from "react";
import { Button } from "./button";
import { Card } from "./card";

const Retro = ({ title, sub }: { title: string; sub: string }) => {
  const [hover, setHover] = useState(false);
  return (
    <div className=" min-h-screen pt-[100px] lg:pt-[200px] pb-[100px]">
      <h1 className=" text-black text-center font-medium text-4xl">{title}</h1>
      <p className=" text-center text-xs sm:text-lg max-w-sm sm:max-w-2xl mx-auto my-4">
        {sub}
      </p>
      <Button
        className="!bg-[#210124]  text-white flex cursor-pointer mx-auto"
        text="View Collection"
      />

      <div className=" grid px-4 sm:px-10 mt-10 sm:grid-cols-2  lg:grid-cols-4 gap-5">
        {[0, 1, 2, 3].map((card) => (
          <Card hover={hover} id={card} setHover={setHover} key={card} />
        ))}
      </div>
    </div>
  );
};

export default Retro;
