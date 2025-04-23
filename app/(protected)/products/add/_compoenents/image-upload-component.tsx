import clsx from "clsx";
import { Label } from "@/components/ui/label";
import { CloudUpload, Trash2 } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { useProductStore } from "@/stores/product-store";
import { getImageSrc } from "@/app/utils/image";
import { toast } from "sonner";

export const ImageSection = () => {
  const { updateProduct, product } = useProductStore();
  const [activeImage, setActiveImage] = useState<number | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      updateProduct({ image: [...(product.image || []), ...acceptedFiles] });
    },
    [product.image, updateProduct]
  );

  const onVideoDrop = useCallback(
    (acceptedFiles: File[]) => {
      updateProduct({ videos: [...(product.videos || []), ...acceptedFiles] });
    },
    [product.videos, updateProduct]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxSize: 3 * 1024 * 1024,
    maxFiles: 10
  });

  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } =
    useDropzone({
      onDrop: onVideoDrop,
      accept: { "video/*": [] },
      maxSize: 3 * 1024 * 1024,
      maxFiles: 1
    });

  return (
    <div>
      <Label htmlFor="image" className="text-gray-700">
        Product Image *
      </Label>
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 text-zinc-600 rounded-md p-2 mt-3 h-[150px] w-full flex flex-col justify-center items-center cursor-pointer"
      >
        <input {...getInputProps()} />
        <CloudUpload size={24} className="mb-2" />
        <p className="text-sm md:text-lg text-center">
          Drag and drop images, or click to select
        </p>
        <p className="text-sm font-medium md:text-lg">Max Size 3MB</p>
      </div>

      {product.image.length > 0 && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {typeof product.image !== "string" &&
            product.image.map((file, index) => (
              <div
                key={index}
                className="relative w-full h-[150px] border-4 border-gray-200 rounded-md shadow-sm cursor-pointer"
                onMouseEnter={() => setActiveImage(index)}
                onMouseLeave={() => setActiveImage(null)}
              >
                <Image
                  src={getImageSrc(file)}
                  alt="Preview"
                  width={100}
                  height={100}
                  unoptimized
                  className="w-full h-full object-cover rounded-md"
                />
                <div
                  className={clsx(
                    "absolute inset-0 flex transition-opacity duration-200 justify-center items-center bg-black/50 rounded-md",
                    activeImage === index
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  )}
                >
                  <button className="text-white font-medium text-xs capitalize">
                    Make thumbnail
                  </button>

                  <Trash2
                    onClick={() => {
                      // updateProduct({
                      //   image: typeof product.image==="object" && product.image.filter((_, i) => i !== index)
                      // });
                      toast.success("Image removed successfully");
                    }}
                    className=" absolute right-3 top-3 cursor-pointer text-white w-5 h-5"
                  />
                </div>
              </div>
            ))}
        </div>
      )}

      <Label htmlFor="video" className="text-gray-700 mt-5">
        Product Videos{" "}
        <span className="text-gray-500">
          (Videos help buyers get insight into look of product)
        </span>{" "}
        *
      </Label>
      <div
        {...getVideoRootProps()}
        className="border-2 border-dashed border-gray-300 text-zinc-600 rounded-md p-2 mt-3 h-[150px] w-full flex flex-col justify-center items-center cursor-pointer"
      >
        <input {...getVideoInputProps()} />
        <CloudUpload size={24} className="mb-2" />
        <p className="text-sm md:text-lg text-center">
          Drag and drop video, or click to select
        </p>
        <p className="text-sm font-medium md:text-lg">Max Size 3MB</p>
      </div>
    </div>
  );
};
