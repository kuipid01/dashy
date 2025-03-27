"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function  Back({ onClick }: { onClick?: () => void }) {
  const router = useRouter();
  return (
    <button className="flex  items-center" onClick={onClick || router.back}>
      <ArrowLeft width={20} height={20} className=" text-zinc-500" />
    </button>
  );
}
