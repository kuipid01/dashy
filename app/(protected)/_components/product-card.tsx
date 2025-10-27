import { Product } from "@/app/(handlers)/types/product";
import { getImageSrc } from "@/app/utils/image";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { Copy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export default function ProductCard({
  product,
  isAdmin,
  storeName
}: {
  storeName?: string;
  isAdmin?: boolean;
  product: Product;
}) {
  return (
    <div className=" hover:border relative hover:scale-[1.02] border border-gray-200 transition-all duration-300 ease-in-out hover:border-gray-300 rounded-xl pb-3  overflow-hidden flex flex-col gap-3">
      <div
        onClick={(e) => {
          e.stopPropagation();

          console.log(
            `${window.location.host}/store/${storeName}/product-details/${product?.id}`
          );
          navigator.clipboard.writeText(
            `${window.location.host}/store/${storeName}/product-details/${product?.id}`
          );
          toast.success("Product link copied");
        }}
        className="absolute z-1 h-8 w-8 p-0  left-5 top-5 px-3 py-1 rounded-md  bg-white text-black flex justify-center items-center"
      >
        <Button variant="ghost" className=" ">
          <Copy size={16} className="" />
        </Button>
      </div>
      <Link
        href={
          isAdmin
            ? `/products/details/${product?.id}`
            : `/store/${storeName}/product-details/${product?.id}`
        }
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
            {/* <div className=" flex items-center gap-1">
            <Star
              fill="oklch(85.2% 0.199 91.936)"
              className="  text-yellow-400 w-5 h-5"
            />
            <p className=" text-sm">{product?.rating}</p>
          </div> */}
          </div>

          <p>₦{product?.discounted_price || product?.price}</p>
        </div>
      </Link>
    </div>
  );
}
