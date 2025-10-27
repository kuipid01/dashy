/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Image from "next/image";
import Link from "next/link";
import { LightBtn, NewBtnDark } from "./new-btn-dark";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge, ShoppingCart, Menu, X, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "@/stores/cart-store";

import { Button } from "./button";
import { Button as Btnshad } from "@/components/ui/button";
import { useFetchUser } from "../(handlers)/auth-handlers/auth";
import { useFetchProduct } from "../(handlers)/general/general";
import { cn } from "@/lib/utils";
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

type FlowStep = "products" | "cart" | "checkout" | "success";

export const NavbarNew = () => {
  const { totalItems } = useCartStore();
  const [activeStore, setactiveStore] = useState<string | undefined>(undefined);
  const pathname = usePathname();
  const [currentStep, setCurrentStep] = useState<FlowStep>("products");
  const [showReward, setShowReward] = useState(false);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [animatingCart, setAnimatingCart] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [progress, setProgress] = useState(0);
  const { user, isLoading: userLoading } = useFetchUser();

  const { data: product, isLoading: productLoading } = useFetchProduct(
    pathname.split("/")[4] ?? undefined
  );
  console.log(pathname.split("/"));
  useEffect(() => {
    if (pathname.includes("/product-details")) {
      const storeName = pathname.split("/")[2];
      console.log(storeName, "storeName");
      setactiveStore(storeName);
    }
  }, [pathname, product]);

  const stepProgress = {
    products: 25,
    cart: 50,
    checkout: 75,
    success: 100
  };

  useEffect(() => {
    setProgress(stepProgress[currentStep]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const container = {
    hidden: { opacity: 0.9 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "afterChildren",

        duration: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0.9, x: -100, y: 0 },
    exit: { opacity: 0, x: -10, y: 0 },
    show: { opacity: 1, x: 0, y: 0 }
  };
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const router = useRouter();
  const links = [
    {
      name: "Discover",
      href: "/discover"
    }
  ];
  return (
    <nav className="max-w-[1121px] fixed lg:relative  z-1000 backdrop-blur-2xl lg:backdrop-blur-none top-0 left-0 right-0 py-4 sm:py-[25px] lg:pt-[45px] mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
      <Image
        src="/assets/logo.svg"
        alt="logo"
        width={120}
        height={30}
        className="w-[100px] sm:w-[120px] h-[25px] sm:h-[30px]"
      />

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-10">
        <div className="flex items-center gap-4">
          {links.map((li) => (
            <Link
              className="text-base font-medium text-black hover:text-gray-600 transition-colors"
              key={li.href}
              href={li.href.toLowerCase()}
            >
              {li.name}
            </Link>
          ))}
        </div>
      </div>

      <div className=" hidden lg:flex">
        <div className="flex items-center gap-4">
          {!userLoading && !user && (
            <>
              <LightBtn text="Login" onClick={() => router.push("/login")} />
              <NewBtnDark
                text="Get Started"
                onClick={() => router.push("/signup")}
                className="!bg-black text-white"
              />
            </>
          )}
          {userLoading && (
            <Loader2 className="w-4 h-4 animate-spin duration-1000" />
          )}

          {/* //TODO */}
          {/* Reward Points */}
          {/* <div
              className={cn(
                "flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20",
                showReward && "reward-pulse"
              )}
            >
              <Gift className="w-4 h-4 text-black " />
              <span className="text-sm font-medium">{rewardPoints} pts</span>
            </div> */}

          {/* Cart Icon */}
          <div className="relative    hidden lg:flex">
            {productLoading ? (
              <Loader2 className="w-4 h-4 animate-spin duration-1000" />
            ) : (
              <Link href={activeStore ? `/cart?store=${activeStore}` : "/cart"}>
                <Btnshad
                  variant="outline"
                  size="sm"
                  className={cn(
                    "relative hover:bg-primary-new",
                    animatingCart && "cart-bounce"
                  )}
                >
                  <ShoppingCart className="w-4 h-4" />

                  <div className="absolute  text-black bg-primary-new  font-bold border-black -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {totalItems}
                  </div>
                </Btnshad>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className=" flex lg:hidden relative  gap-4 items-center">
        <div className="relative">
          {productLoading ? (
            <Loader2 className="w-4 h-4 animate-spin duration-1000" />
          ) : (
            <Link href={activeStore ? `/cart?store=${activeStore}` : "/cart"}>
              <Btnshad
                variant="outline"
                size="sm"
                className={cn(
                  "relative cursor-pointer bg-primary-new hover:bg-primary-new",
                  animatingCart && "cart-bounce"
                )}
              >
                <ShoppingCart className="w-4 h-4" />

                <div className="absolute  text-black bg-primary-new border border-black -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {totalItems}
                </div>
              </Btnshad>
            </Link>
          )}
        </div>
        <div
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="flex z-100000  cursor-pointer flex-col text-black gap-1"
        >
          <motion.div
            animate={{
              rotate: showMobileMenu ? 45 : 0
            }}
            className=" w-[25px] shrink-0 border-b-[2px] border-black"
          ></motion.div>
          <motion.div
            animate={{
              rotate: showMobileMenu ? -45 : 0
            }}
            className=" w-[25px] border-b-[2px] shrink-0 border-black"
          ></motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            key="mobile-menu"
            exit={{ opacity: 0.8, top: `0vh`, filter: "blur(4px)", height: 0 }}
            initial={{
              opacity: 0.8,
              top: `0vh`,
              filter: "blur(4px)",
              height: 0
            }}
            animate={{
              opacity: 1,
              top: `0vh`,
              left: 0,
              right: 0,
              height: `100vh`,
              filter: "blur(0px)"
            }}
            transition={{
              duration: 0.5
            }}
            className="w-full  lg:hidden absolute  bg-primary-new-new"
          >
            <div className="flex pb-[10px] pt-20 flex-col h-[100dvh] md:h-[100vh] justify-between items-end">
              <motion.ul
                variants={container}
                initial="hidden"
                animate="show"
                exit="exit"
                className=" "
              >
                <motion.li
                  className="text-right text-4xl font-semibold px-5 py-3"
                  variants={item}
                >
                  <Link href="/features">Features</Link>
                </motion.li>
                <motion.li
                  className="text-right text-4xl font-semibold px-5 py-3"
                  variants={item}
                >
                  <Link href="/pricing">Pricing</Link>
                </motion.li>
                <motion.li
                  className="text-right text-4xl font-semibold px-5 py-3"
                  variants={item}
                >
                  <Link href="/contact">Contact</Link>
                </motion.li>
                <motion.li
                  className="text-right text-4xl font-semibold px-5 py-3"
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
                    className="flex bg-primary-new-new gap-5 px-5"
                  >
                    {!userLoading && !user && (
                      <>
                        <LightBtn
                          onClick={() => router.push("/login")}
                          className="!rounded-[5px]"
                          text="Log In"
                        />
                        <NewBtnDark
                          onClick={() => router.push("/signup")}
                          className="!bg-black text-white !rounded-[5px]"
                          text="Sign Up"
                        />
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
