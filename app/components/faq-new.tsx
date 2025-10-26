"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const FaqNew = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData = [
    {
      question: "What is Hubsell and how does it work?",
      answer:
        "Hubsell is an all-in-one platform that automates your social media marketing, content creation, and customer engagement. It uses AI to create posts, schedule content, and manage your online presence across multiple platforms."
    },
    // {
    //   question: "How much does Hubsell cost?",
    //   answer:
    //     "We offer flexible pricing plans starting from $29/month for individual creators to $199/month for enterprise teams. All plans include a 14-day free trial with no credit card required."
    // },
    {
      question: "Can I connect multiple social media accounts?",
      answer:
        "Yes! Hubsell supports Instagram, Facebook, Twitter, LinkedIn, and TikTok. You can connect unlimited accounts and manage them all from one dashboard."
    },
    {
      question: "Is there a mobile app available?",
      answer:
        "Currently, Hubsell is optimized for web browsers and works perfectly on mobile devices. We're developing dedicated mobile apps for iOS and Android, coming soon in 2026."
    },
    {
      question: "What kind of support do you offer?",
      answer:
        "We provide 24/7 email support, live chat during business hours, and comprehensive documentation. Premium users get priority support and dedicated account managers."
    }
    // {
    //   question: "Can I cancel my subscription anytime?",
    //   answer:
    //     "Absolutely! You can cancel your subscription at any time from your account settings. Your access continues until the end of your current billing period, and you can reactivate anytime."
    // }
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const faqItem = {
    hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.5,
        ease: [0.17, 0.67, 0.83, 0.67] as [number, number, number, number]
      }
    }
  };

  return (
    <section className="py-20 px-4 bg-[#faf9f6]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-serif font-bold text-gray-900 mb-4">
            FAQs
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get answers to the most common questions about Hubsell
          </p>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-0"
        >
          {faqData.map((item, index) => (
            <motion.div
              key={index}
              variants={faqItem}
              className="border-b border-gray-200 last:border-b-0"
            >
              <button
                className="w-full flex items-center justify-between py-6 px-0 text-left hover:bg-gray-50/50 transition-colors duration-200 focus:outline-none _focus:ring-2 focus:ring-gray-200 rounded-lg"
                onClick={() => toggleAccordion(index)}
              >
                <span className="text-lg font-medium text-gray-900 pr-4">
                  {item.question}
                </span>
                <ChevronDown
                  size={20}
                  className={`text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: [0.17, 0.67, 0.83, 0.67] }}
                className="overflow-hidden"
              >
                <div className="pb-6">
                  <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FaqNew;
