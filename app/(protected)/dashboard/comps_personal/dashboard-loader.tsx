/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { motion } from "framer-motion";

const colors = ["#6366F1", "#10B981", "#F59E0B", "#EF4444"]; // indigo, emerald, amber, red

const Dashboardloader = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center select-none">
      <div className="flex items-end gap-3">
        {colors.map((c, i) => (
          <motion.span
            key={c}
            className="block h-4 w-4 rounded-full"
            style={{ backgroundColor: c }}
            animate={{
              y: [0, -18, 0]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut" as any,
              delay: i * 0.12
            }}
          />
        ))}
      </div>
      <motion.p
        className="mt-6 text-sm text-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
      >
        Setting up dashboard...
      </motion.p>
    </div>
  );
};

export default Dashboardloader;
