"use client";
import clsx from "clsx";
import { Search, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";

export const Navbar = () => {
  const [hoverState, setHoverState] = useState({
    state: "",
    status: false
  });

  // New state to track if the page is at the top
  const [isTop, setIsTop] = useState(true);

  // Effect to handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY === 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  console.log(hoverState);
  return (
    <div
      onMouseLeave={() => {
        setHoverState({
          state: "",
          status: false
        });
      }}
      className="fixed h-fit w-full items-start  z-10 flex flex-col _gap-10"
    >
      <nav
        className={clsx(
          "flex  py-4 px-4 sm:px-10 w-full   justify-between  items-center _h-[10vh]",
          hoverState.status && "hidden",
          isTop
            ? "sm:bg-transparent bg-white text-black sm:text-white"
            : " bg-white"
        )}
      >
        <div className="lg:flex  hidden gap-3 items-center">
          <div
            onMouseEnter={() => {
              setHoverState({
                state: "Men",
                status: true
              });
            }}
            className={clsx(
              "cursor-pointer",
              hoverState.status && "text-black"
            )}
          >
            Men
          </div>
          <div
            onMouseEnter={() => {
              setHoverState({
                state: "Women",
                status: true
              });
            }}
            className={clsx(
              "cursor-pointer",
              hoverState.status && "text-black"
            )}
          >
            Women
          </div>
        </div>
        <div className=" flex lg:hidden flex-col gap-1">
          <div className=" w-[15px] shrink-0 border-b-[1px] border-black"></div>
          <div className=" w-[15px] border-b-[1px] shrink-0 border-black"></div>
        </div>
        <p>Dashy</p>

        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-3">
            <Search size={24} />
            <span className="hidden sm:block">Search</span>
          </div>
          <div className="flex gap-1 items-center">
            <ShoppingBag />
            <span className="hidden sm:block">(0)</span>
          </div>
        </div>
      </nav>
      <Extended state={hoverState} />
    </div>
  );
};

const Extended = ({
  state
}: {
  state: {
    state: string;
    status: boolean;
  };
}) => {
  return (
    <div
      className={clsx(
        " bg-white z-50 px-4 sm:px-10  text-black w-full",
        state.status && state.state !== ""
          ? "h-[300px] top-0 pointer-events-auto opacity-100 duration-500 transition-all"
          : "h-0 top-[calc(-(500px+10vh))] opacity-0 pointer-events-none "
      )}
    >
      <Nav />
    </div>
  );
};

const Nav = () => {
  return (
    <div className="">
      <nav
        className={clsx(
          " hidden sm:flex  py-4 border-b border-gray-200 w-full text-black   justify-between  items-center _h-[10vh]"
        )}
      >
        <div className="hidden items-center lg:flex gap-4">
          <div className=" cursor-pointer">Men</div>
          <div className=" cursor-pointer">Women</div>
        </div>

        <p>Dashy</p>

        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-3">
            <Search size={24} />
            <span>Search</span>
          </div>
          <div className="flex gap-1 items-center">
            <ShoppingBag />
            <span>(0)</span>
          </div>
        </div>
      </nav>
    </div>
  );
};
