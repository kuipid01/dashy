"use client";
import React from "react";
import { cubicBezier, motion } from "framer-motion";

const WhyLoveHubsell = () => {
  const benefits = [
    {
      title: "Everything just flows",
      description:
        "Automation feels natural, not forced. Hubsell connects your store, socials, and brand so everything runs smoothly without constant tinkering.",
      imagePlaceholder: true,
      wide: true
    },
    {
      title: "Work less, grow more",
      description:
        "Hubsell takes care of your routine marketing — from posting to ad creation — so you can focus on products and people, not platforms.",
      imagePlaceholder: true,
      wide: false
    },
    {
      title: "Built for speed",
      description:
        "We don't just post. We understand timing, tone, and placement — forget endless setup. From signup to your first automated post, everything happens in minutes.",
      imagePlaceholder: true,
      wide: false
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: cubicBezier(0.17, 0.67, 0.83, 0.67)
      }
    }
  };

  return (
    <section className="pt-16 px-4 bg-[#FDF9F4]">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-serif text-[#333333] mb-4"
          >
            Why you will love using hubsell
          </motion.h2>
        </div>

        {/* Benefits Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-8"
        >
          {/* Top Card - Wide */}
          <motion.div
            variants={item}
            className="bg-white h-[500px] rounded-lg p-[34px] lg:p-[54px] shadow-sm border border-gray-100"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">
              {/* Text Content */}
              <div>
                <h3 className="h2 text-black mb-4">{benefits[0].title}</h3>
                <p className="lg text-black/50 max-w-[536px] leading-relaxed">
                  {benefits[0].description}
                </p>
              </div>

              {/* Image Placeholder */}
              <div className="bg-darker-new-light border border-darker-new-grey rounded-lg h-[200px] md:h-[392px] flex items-center justify-center">
                <div className="text-gray-400 text-sm">Image placeholder</div>
              </div>
            </div>
          </motion.div>

          {/* Bottom Two Cards */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Left Card */}
            <motion.div
              variants={item}
              className="bg-white rounded-lg p-8 shadow-sm border border-gray-100"
            >
              <div className="space-y-6 flex flex-col justify-between h-[620px]">
                {/* Text Content */}
                <div>
                  <h3 className="h2 text-black mb-4">{benefits[1].title}</h3>
                  <p className="lg text-black/50 max-w-[536px] leading-relaxed">
                    {benefits[1].description}
                  </p>
                </div>

                {/* Image Placeholder */}
                <div className="bg-darker-new-light border border-darker-new-grey rounded-lg h-[392px] flex items-center justify-center">
                  <div className="text-gray-400 text-sm">Image placeholder</div>
                </div>
              </div>
            </motion.div>

            {/* Right Card */}
            <motion.div
              variants={item}
              className="bg-white rounded-lg p-8 shadow-sm border border-gray-100"
            >
              <div className="space-y-6 flex flex-col justify-between h-[620px]">
                {/* Text Content */}
                <div>
                  <h3 className="h2 text-black mb-4">{benefits[2].title}</h3>
                  <p className="lg text-black/50 max-w-[536px] leading-relaxed">
                    {benefits[2].description}
                  </p>
                </div>

                {/* Image Placeholder */}
                <div className="bg-darker-new-light rounded-lg h-[392px] flex items-center justify-center">
                  <div className="text-gray-400 text-sm">Image placeholder</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyLoveHubsell;
