"use client";
import clsx from "clsx";
import Link from "next/link";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
export const Navbar = () => {
  const container = {
    hidden: { opacity: 0.9 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "afterChildren",

        duration: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0.9, x: -100, y: 0 },
    exit: { opacity: 0, x: -10, y: 0 },
    show: { opacity: 1, x: 0, y: 0 },
  };
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const router = useRouter();
  return (
    <div className="fixed h-fit w-full items-start  z-100 flex flex-col _gap-10">
      <nav
        className={clsx(
          "flex  py-4 px-4 sm:px-10 w-full bg-primary  justify-between  items-center h-[7vh] lg:h-[10vh]"
        )}
      >
        <p className=" text-[20px] font-bold">Hubsell</p>
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/discover">Discover</Link>
        </div>
        <Button
          onClick={() => router.push("/signup")}
          className=" hidden cursor-pointer lg:block !bg-black text-white"
          text="Get Started"
        />
        <div
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className=" flex lg:hidden flex-col text-black gap-1"
        >
          <motion.div
            animate={{
              rotate: showMobileMenu ? 45 : 0,
            }}
            className=" w-[25px] shrink-0 border-b-[2px] border-black"
          ></motion.div>
          <motion.div
            animate={{
              rotate: showMobileMenu ? -45 : 0,
            }}
            className=" w-[25px] border-b-[2px] shrink-0 border-black"
          ></motion.div>
        </div>
      </nav>
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            key="mobile-menu"
            exit={{ opacity: 0.8, top: `7vh`, height: 0 }}
            initial={{ opacity: 0.8, top: `7vh`, height: 0 }}
            animate={{
              opacity: 1,
              top: `7vh`,
              left: 0,
              right: 0,
              height: `93vh`,
            }}
            transition={{
              duration: 0.7,
            }}
            className="w-full lg:hidden absolute bg-primary"
          >
            <div className="flex pb-[10px] flex-col h-[93vh] justify-between items-end">
              <motion.ul
                variants={container}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                <motion.li
                  className="text-right text-2xl font-semibold px-5 py-3"
                  variants={item}
                >
                  <Link href="/features">Features</Link>
                </motion.li>
                <motion.li
                  className="text-right text-2xl font-semibold px-5 py-3"
                  variants={item}
                >
                  <Link href="/pricing">Pricing</Link>
                </motion.li>
                <motion.li
                  className="text-right text-2xl font-semibold px-5 py-3"
                  variants={item}
                >
                  <Link href="/contact">Contact</Link>
                </motion.li>
                <motion.li
                  className="text-right text-2xl font-semibold px-5 py-3"
                  variants={item}
                >
                  <Link href="/discover">Discover</Link>
                </motion.li>
              </motion.ul>

              {/* Separate AnimatePresence for instant exit */}
              <AnimatePresence>
                {showMobileMenu && (
                  <motion.div
                    key="buttons"
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }} // Instant disappearance on close
                    transition={{ duration: 0.1 }}
                    className="flex bg-primary gap-5 px-5"
                  >
                    <Button className="!rounded-[5px]" text="Log In" />
                    <Button
                      className="!bg-black text-white !rounded-[5px]"
                      text="Sign Up"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
