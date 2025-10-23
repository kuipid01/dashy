"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search, Sparkles } from "lucide-react";

interface LandingScreenProps {
  onDiscover: () => void;
  onSearch: () => void;
}

export default function LandingScreen({
  onDiscover,
  onSearch
}: LandingScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen discover-gradient flex flex-col items-center justify-center p-6 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-pink-200/30 to-blue-200/30 rounded-full blur-3xl"
        />
      </div>

      {/* Main content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-center z-10 max-w-2xl mx-auto"
      >
        {/* Main headline */}
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.4,
            duration: 0.5,
            type: "spring",
            stiffness: 100
          }}
          className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
        >
          Discover something new{" "}
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="inline-block"
          >
            🔎
          </motion.span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-xl text-gray-600 mb-12 leading-relaxed"
        >
          Swipe through products picked just for you.
        </motion.p>

        {/* Primary CTA */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              onClick={onDiscover}
              size="lg"
              className="w-full max-w-md discover-button-gradient text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Discover Now
            </Button>
          </motion.div>
        </motion.div>

        {/* Secondary CTA */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSearch}
          className="text-gray-600 hover:text-gray-800 font-medium text-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
        >
          <Search className="w-5 h-5" />I know what I want
        </motion.button>
      </motion.div>

      {/* Bottom tagline */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <p className="text-sm text-gray-500 text-center">
          Powered by your preferences and trends.
        </p>
      </motion.div>
    </motion.div>
  );
}
