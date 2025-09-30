"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Back({ onClick }: { onClick?: () => void }) {
  const router = useRouter();
  return (
    <div
      onClick={onClick || router.back}
      className=" w-fit flex gap-2 px-3 py-1 hover:bg-gray-100 transition duration-200 rounded-md bg-gray-200  border border-zinc-400"
    >
      <button className="flex  cursor-pointer items-center">
        <ArrowLeft width={20} height={20} className=" text-zinc-500" />
      </button>
      <p className=" cursor-pointer font-bold">Go Back</p>
    </div>
  );
}
