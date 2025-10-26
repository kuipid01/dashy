"use client";
import React from "react";
import Image from "next/image";
import { NewBtnDark } from "./new-btn-dark";
import { Quote } from "lucide-react";
import { motion, cubicBezier } from "framer-motion";

const SocialProof = () => {
  const testimonials = [
    {
      id: 1,
      quote:
        "Hubsell saves us hours every week. Our social posts, ads, and updates now run themselves.",
      author: {
        name: "Sarah Adeyemi",
        title: "Marketing Lead at Bloom & Co",
        avatar: "/assets/man.jpg" // You can replace with actual avatar
      }
    },
    {
      id: 2,
      quote: "We launched faster and reached more people with half the effort.",
      author: {
        name: "Anita Johnson",
        title: "Growth Manager at Tryspace",
        avatar: "/assets/woman.jpg" // You can replace with actual avatar
      }
    }
  ];

  const stats = [
    {
      value: "50% less",
      description: "time spent on marketing tasks",
      company: "Tola Stores",
      image: "/assets/landing-page/save.png"
    },
    {
      value: "3x more",
      description: "followers on Instagram",
      company: "Bloom & Co",
      image: "/assets/landing-page/shout.svg"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.7,
        ease: cubicBezier(0.17, 0.67, 0.83, 0.67)
      }
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-[101px] mt-16 sm:mt-32 md:mt-48 lg:mt-[240px] min-h-[800px] sm:min-h-[1000px] lg:min-h-[1637px] px-4 sm:px-6 md:px-8 lg:px-[143px] relative">
      <Image
        src="/assets/landing-page/rect.png"
        alt="Background"
        fill
        className="absolute z-0 w-full h-full top-0 left-0 object-cover"
      />

      {/* Header Section */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-col lg:flex-row mb-8 lg:mb-5 relative z-10 justify-between items-center gap-6 lg:gap-0"
      >
        <motion.div
          variants={item}
          className="flex flex-col mt-10 lg:mt-0 gap-4 lg:gap-5 max-w-full lg:max-w-[708px]"
        >
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[48px] font-medium text-left leading-tight">
            Creators everywhere and business owners attest to the magic of
            Hubsell
          </p>
          <NewBtnDark
            className="!bg-black text-white w-fit"
            text="See customer stories"
          />
        </motion.div>
        <motion.div variants={item} className="hidden lg:block">
          <Image
            src="/assets/landing-page/image-review.png"
            alt="Review"
            width={522}
            height={472}
            className="w-[400px] lg:w-[522px] h-auto object-cover"
          />
        </motion.div>
      </motion.div>

      {/* Main Content Section */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="flex flex-col xl:flex-row relative gap-6 lg:gap-[30px] items-start"
      >
        {/* Testimonial Card */}
        <motion.div
          variants={item}
          className="flex flex-col lg:flex-row gap-4 lg:gap-[30px] items-start w-full xl:w-auto"
        >
          <div className="hidden lg:block">
            <Image
              src="/assets/landing-page/man.png"
              alt="Review"
              width={250}
              height={250}
              className="w-[200px] lg:w-[250px] h-auto object-cover"
            />
          </div>
          <div className="w-full lg:w-[682px] relative min-h-[400px] lg:min-h-[580px] bg-white rounded-[15px] p-6 sm:p-8 lg:px-[92px] lg:pt-[90px]">
            <Quote className="absolute rotate-180 top-6 lg:top-[90px] left-4 lg:left-[51px] text-black size-8 lg:size-10" />
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[48px] font-medium text-left leading-tight mt-8 lg:mt-0 max-w-[536px]">
              Hubsell saves us hours every week. Our social posts, ads, and
              updates now run themselves.
            </p>

            <div className="flex items-center gap-3 mt-6 lg:mt-8">
              <Image
                src="/assets/landing-page/user-profile.png"
                alt={testimonials[0].author.name}
                width={100}
                height={100}
                className="w-[60px] lg:w-[100px] h-[60px] lg:h-[100px] object-cover rounded-full"
              />
              <div className="flex flex-col gap-1 lg:gap-2">
                <p className="text-lg lg:text-2xl font-medium text-left">
                  {testimonials[0].author.name}
                </p>
                <p className="text-sm lg:text-xl text-left text-black/50">
                  {testimonials[0].author.title}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col gap-4 lg:gap-5 w-full xl:w-auto"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.company}
              variants={item}
              className="flex relative overflow-hidden bg-white min-h-[200px] lg:min-h-[280px] flex-col items-start rounded-[15px] p-4 sm:p-6 lg:p-[32px] gap-2"
            >
              {stat.image && (
                <Image
                  src={stat.image}
                  alt={stat.company}
                  width={406}
                  height={280}
                  className="absolute rotate-[25deg] bottom-[-30%] left-[127px] _top-[-98px] object-cover"
                />
              )}
              <div className="flex flex-col">
                <p className="text-2xl sm:text-3xl lg:text-4xl xl:text-[48px] font-medium text-left text-black">
                  {stat.value}
                </p>
                <p className="text-sm sm:text-base lg:text-xl text-left text-black/50">
                  {stat.description}
                </p>
              </div>
              <p className="text-sm sm:text-base lg:text-xl text-left text-black mt-auto">
                {stat.company}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom Section */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="flex flex-col lg:flex-row gap-4 lg:gap-[18px] relative mt-8 lg:mt-5 justify-center items-center"
      >
        <motion.div
          variants={item}
          className="w-full rounded-[15px] bg-white p-6 sm:p-8 lg:px-[60px] lg:py-[46px]"
        >
          <p className="text-xl sm:text-2xl lg:text-3xl xl:text-[32px] font-medium text-left text-black leading-tight">
            We launched faster and reached more people with half the effort.
          </p>
          <div className="flex items-center gap-4 lg:gap-[18px] mt-4 lg:mt-6">
            <Image
              src="/assets/landing-page/anita.png"
              alt="Review"
              width={100}
              height={100}
              className="w-[60px] lg:w-[100px] h-[60px] lg:h-[100px] object-cover rounded-full"
            />
            <div className="flex flex-col">
              <p className="text-lg lg:text-2xl font-medium text-left text-black">
                {testimonials[1].author.name}
              </p>
              <p className="text-sm lg:text-xl text-left text-black/50 mt-auto">
                {testimonials[1].author.title}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default SocialProof;
