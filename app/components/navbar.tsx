/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import clsx from "clsx";
import Link from "next/link";
import { Button } from "./button";
import { Button as Btnshad } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Gift, Loader2, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cart-store";
import path from "path";
import { useFetchProduct } from "../(handlers)/general/general";
import { useFetchUser } from "../(handlers)/auth-handlers/auth";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  category: string;
}

type FlowStep = "products" | "cart" | "checkout" | "success";

interface CartItem extends Product {
  quantity: number;
}

export const Navbar = () => {
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
  }, [currentStep]);

  const addToCart = (product: Product) => {
    setAnimatingCart(true);
    setTimeout(() => setAnimatingCart(false), 600);

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    // Add reward points
    setRewardPoints((prev) => prev + Math.floor(product.price * 0.1));
    setShowReward(true);
    setTimeout(() => setShowReward(false), 2000);
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const completeOrder = () => {
    const orderPoints = Math.floor(getTotalPrice() * 0.05);
    setRewardPoints((prev) => prev + orderPoints);
    setCurrentStep("success");
    setShowReward(true);
    setTimeout(() => setShowReward(false), 3000);
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
  return (
    <div className="fixed h-fit w-full items-start  z-100 flex flex-col _gap-10">
      <nav
        className={clsx(
          "flex  py-4 px-4 sm:px-10 w-full bg-primary  justify-between  items-center h-[7vh] lg:h-[10vh]"
        )}
      >
        <Link href="/" className=" text-[20px] font-bold">
          Hubsell
        </Link>
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/discover">Discover</Link>
        </div>

        <div className="flex">
          <div className="flex items-center gap-4">
            {!userLoading && !user && (
              <>
                <Button
                  onClick={() => router.push("/login")}
                  className=" hidden cursor-pointer lg:block !bg-white text-black"
                  text="Login"
                />
                <Button
                  onClick={() => router.push("/signup")}
                  className=" hidden cursor-pointer lg:block !bg-black text-white"
                  text="Get Started"
                />
              </>
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
                <Link
                  href={activeStore ? `/cart?store=${activeStore}` : "/cart"}
                >
                  <Btnshad
                    variant="outline"
                    size="sm"
                    className={cn(
                      "relative hover:bg-primary",
                      animatingCart && "cart-bounce"
                    )}
                  >
                    <ShoppingCart className="w-4 h-4" />

                    <Badge className="absolute  text-black bg-white border border-black -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {totalItems}
                    </Badge>
                  </Btnshad>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className=" flex lg:hidden  gap-4 items-center">
          <div className="relative">
            {productLoading ? (
              <Loader2 className="w-4 h-4 animate-spin duration-1000" />
            ) : (
              <Link href={activeStore ? `/cart?store=${activeStore}` : "/cart"}>
                <Btnshad
                  variant="outline"
                  size="sm"
                  className={cn(
                    "relative hover:bg-primary",
                    animatingCart && "cart-bounce"
                  )}
                >
                  <ShoppingCart className="w-4 h-4" />

                  <Badge className="absolute  text-black bg-white border border-black -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {totalItems}
                  </Badge>
                </Btnshad>
              </Link>
            )}
          </div>
          <div
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="flex  cursor-pointer flex-col text-black gap-1"
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
              height: `93vh`
            }}
            transition={{
              duration: 0.7
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
                    {!userLoading && !user && (
                      <>
                        <Button
                          onClick={() => router.push("/login")}
                          className="!rounded-[5px]"
                          text="Log In"
                        />
                        <Button
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
    </div>
  );
};
