"use client";
import React from "react";
import { ShoppingCart, Store, TrendingUp } from "lucide-react";
import { cubicBezier, motion } from "framer-motion";
const HowItWorks = () => {
  const steps = [
    {
      icon: <ShoppingCart className="w-6 h-6" />,
      title: "Create Your Store",
      description:
        "Create your online store in seconds — add your products, logo, and brand details, all in one dashboard.",
      cta: "Try Now →"
    },
    {
      icon: <Store className="w-6 h-6" />,
      title: "Customize Your Brand",
      description:
        "Personalize your store with your brand colors, logo, and unique style to match your business identity.",
      cta: "Customize →"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Start Selling",
      description:
        "Launch your store and start accepting orders immediately. Track sales and grow your business with built-in analytics.",
      cta: "Launch →"
    }
  ];
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const item = {
    hidden: {
      opacity: 0,
      y: 30,
      filter: "blur(8px)",
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      scale: 1,
      transition: {
        duration: 0.7,
        ease: cubicBezier(0.17, 0.67, 0.83, 0.67)
      }
    }
  };
  return (
    <section className="py-16 min-h-[400px] px-4 bg-primary-new">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.6,
            ease: cubicBezier(0.17, 0.67, 0.83, 0.67)
          }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-[#333333] mb-4">
            How it works
          </h2>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{
                scale: 1.02,
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="bg-[#F76B30] rounded-lg p-8 text-white shadow-lg hover:shadow-xl"
            >
              {/* Icon and Title */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex items-center gap-3 mb-4"
              >
                <motion.div
                  whileHover={{ rotate: 5 }}
                  transition={{ duration: 0.2 }}
                  className="text-white"
                >
                  {step.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-white">{step.title}</h3>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="text-white text-base leading-relaxed mb-6"
              >
                {step.description}
              </motion.p>

              {/* Call to Action */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-white font-bold text-base hover:underline transition-all duration-200"
              >
                {step.cta}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
