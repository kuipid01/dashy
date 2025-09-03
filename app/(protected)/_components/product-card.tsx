import { Product } from "@/app/(handlers)/types/product";
import { getImageSrc } from "@/app/utils/image";
import clsx from "clsx";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({
  product,
  isAdmin
}: {
  isAdmin?: boolean;
  product: Product;
}) {
  return (
    <Link
      href={
        isAdmin
          ? `/products/details/${product?.id}`
          : `/product-details/${product?.id}`
      }
      className=" hover:border relative hover:scale-[1.02] transition-all duration-500 ease-in-out hover:border-gray-200 rounded-xl pb-3  overflow-hidden flex flex-col gap-3"
    >
      <div
        className={clsx(
          " absolute z-1 right-5 font-medium text-xs uppercase text-white top-5 px-3 py-1 rounded-md  ",
          product?.live ? "bg-green-800" : " bg-red-800"
        )}
      >
        {" "}
        {product?.live ? "Active" : "Inactive"}
      </div>
      <div className=" bg-[var(--input)] relative h-[250px] flex items-center justify-center">
        <Image
          src={
            typeof product.image === "string"
              ? product.image
              : getImageSrc(product?.image[0])
          }
          alt={product?.name}
          unoptimized
          fill
          className=" object-cover"
        />
      </div>
      <div className=" flex px-1 justify-between items-center">
        <div className=" flex flex-col items-start gap-1">
          <p className=" font-bold text-xl">{product?.name}</p>
          <div className=" flex items-center gap-1">
            <Star fill="#71717b" className=" text-zinc-500 w-5 h-5" />
            <p className=" text-sm">{product?.rating}</p>
          </div>
        </div>

        <p>₦{product?.price}</p>
      </div>
    </Link>
  );
}
