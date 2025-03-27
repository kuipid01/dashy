import { Product } from "@/constants/types";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product-details/${product.name}`}
      className=" hover:border hover:scale-[1.02] transition-all duration-500 ease-in-out hover:border-gray-200 rounded-xl pb-3  overflow-hidden flex flex-col gap-3"
    >
      <div className=" bg-[var(--input)] relative h-[250px] flex items-center justify-center">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className=" object-cover"
        />
      </div>
      <div className=" flex px-1 justify-between items-center">
        <div className=" flex flex-col items-start gap-1">
          <p className=" font-bold text-xl">{product.name}</p>
          <div className=" flex items-center gap-1">
            <Star fill="#71717b" className=" text-zinc-500 w-5 h-5" />
            <p className=" text-sm">{product.rating}</p>
          </div>
        </div>

        <p>${product.price}</p>
      </div>
    </Link>
  );
}
