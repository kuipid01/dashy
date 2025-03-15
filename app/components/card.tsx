import Image from "next/image";
import { useState } from "react";

export const Card = ({
  tag = "New",
  hover,
  setHover,
  id
}: {
  tag?: string;
  hover: boolean;
  id: number;
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [idPassed, setidPassed] = useState<number | null>(null);
  return (
    <div className="flex  cursor-pointer flex-col gap-3">
      <div
        onMouseEnter={() => {
          setHover(true);
          setidPassed(id);
        }}
        onMouseLeave={() => {
          setHover(false);
          setidPassed(null);
        }}
        className=" h-[450px]  overflow-hidden rounded-md relative"
      >
        {hover && id === idPassed ? (
          <Image src="/assets/retro.jpg" className="rounded-md" alt="" fill />
        ) : (
          <Image src="/assets/retro2.jpg" className="rounded-md" alt="" fill />
        )}
        <div className="absolute top-3 left-3 px-2 py-1 text-xs text-white bg-black rounded-md uppercase">
          {tag}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className=" font-medium">Crystal Horizon Sunglasses</p>
        <p>
          $39 <span className=" text-gray-500 line-through">$70</span>{" "}
        </p>
      </div>
    </div>
  );
};
