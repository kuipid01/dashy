"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useScroll, useTransform, motion, cubicBezier } from "framer-motion";

const DashboardNew = () => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const t = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const scale = useTransform(t, [0, 0.5, 1], [0.6, 1, 0.8], {
    ease: cubicBezier(0.17, 0.67, 0.83, 0.67)
  });

  // If you want the animation to be noticeable and then settle (like a smooth entrance):
  const MotionImage = motion(Image);

  return (
    <>
      {/* <div className=" h-[50px] relative bg-gradient-to-b from-transparent to-primary w-full" /> */}
      <div ref={ref} className="relative overflow-hidden w-full mt-20  ">
        {/* Background Image (Not animated) */}
        <Image
          src="/assets/landing-page/path.svg"
          alt="background path"
          width={1000}
          height={1000}
          className="w-full h-auto mix-blend-color-burn object-cover"
        />

        {/* Animated Dashboard Image */}
        <MotionImage
          style={{ scale }}
          src="/assets/landing-page/dash.png"
          alt="dashboard"
          width={1000}
          height={1000}
          className="w-full max-w-[1217px] h-auto absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 object-contain"
        />
      </div>
    </>
  );
};

export default DashboardNew;
