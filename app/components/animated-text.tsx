import React from "react";
import { Easing, motion } from "framer-motion";

const AnimatedText = ({
  text,
  className,
  delay = 0
}: {
  text: string;
  className: string;
  delay?: number;
}) => {
  const characters = Array.from(text);
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delay: delay
      }
    }
  };
  const item = {
    hidden: { opacity: 0, y: 15, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.4,
        ease: "easeInOut" as Easing
      }
    }
  };
  return (
    <motion.p
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={item}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.p>
  );
};

export default AnimatedText;
