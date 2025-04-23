"use client";
import { InputComponent } from "@/app/(protected)/_components/input-component";
import Newbtn from "@/app/(protected)/_components/new-black-btn";
import UseAi from "@/app/(protected)/_components/use-ai";
import { mockProducts } from "@/constants/mock_data";
import { cn } from "@/lib/utils";
import { Product } from "@/stores/product-store";
import { Pen, SaveAll } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const PoductSec = () => {
  const product: Product = {
    name: "Sample Product",
    description: "This is a great product that does amazing things.",
    price: 99,
    category: "NA",
    image: ["/assets/login.jpg", "/assets/login.jpg", "/assets/login.jpg"],
    videos: [],
    stock: 1,
    discountedPrice: 0,
    rating: 3
  };

  const [canBeEdited, setCanBeEdited] = useState(false);
  //   const [editi, setediti] = useState(second)
  //   const disabled = true;
  return (
    <div className="border p-4 max-h-fit rounded-lg shadow-md">
      <div className="flex mb-2 justify-between items-center">
        <p>Product Details</p>
        <Newbtn
          onClick={() => {
            setCanBeEdited(!canBeEdited);
          }}
        >
          {canBeEdited ? (
            <>
              <SaveAll size={16} />{" "}
              <span className=" text-sm uppercase">Save</span>
            </>
          ) : (
            <>
              <Pen size={16} /> <span className=" text-sm uppercase">Edit</span>
            </>
          )}
        </Newbtn>
      </div>

      <div className="grid border-t border-gray-200 pt-3 gap-3 grid-cols-1">
        <InputComponent
          label="Product Name"
          name="Product Name"
          placeholder={mockProducts[0].name}
          disabled={!canBeEdited}
        />

        <InputComponent
          label="Product Category"
          name="Product Category"
          placeholder={mockProducts[0].category}
          disabled={!canBeEdited}
        />
        <div className="grid grid-cols-3 gap-3 ">
          <InputComponent
            label="Product Price"
            name="Product Price"
            type="number"
            placeholder={String(mockProducts[0].price)}
            disabled={!canBeEdited}
          />
          <InputComponent
            label=" Discount Price"
            name="Product Discount Price"
            type="number"
            placeholder={String(mockProducts[0].discountedPrice)}
            disabled={!canBeEdited}
          />
          <InputComponent
            label=" Stock Quantity"
            name="Product Stock Price"
            type="number"
            placeholder={String(mockProducts[0].discountedPrice)}
            disabled={!canBeEdited}
          />
        </div>

        <div className="flex mt-3  justify-between items-center">
          <p>Product Description</p>
          <UseAi />
        </div>
        <textarea
          disabled={!canBeEdited}
          name="description"
          id="description"
          className={cn(
            "shadow-sm h-[200px] p-2 focus:ring-indigo-500 border border-gray-300 focus:border-indigo-500 block w-full sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:ring-gray-900 dark:focus:border-gray-900",
            !canBeEdited ? " cursor-not-allowed bg-gray-200" : ""
          )}
          placeholder={mockProducts[0].description}
        />
      </div>
      <div className="border mt-4 p-4 rounded-lg shadow-md">
        <div className="flex mb-2 justify-between items-center">
          <p>Product Media</p>
          <Newbtn
            onClick={() => {
              setCanBeEdited(!canBeEdited);
            }}
          >
            {canBeEdited ? (
              <>
                <SaveAll size={16} />{" "}
                <span className=" text-sm uppercase">Save</span>
              </>
            ) : (
              <>
                <Pen size={16} />{" "}
                <span className=" text-sm uppercase">Edit</span>
              </>
            )}
          </Newbtn>
        </div>
        <div className="flex gap-4">
          {typeof product.image !== "string" &&
            product.image.map((url, index) => (
              <Image
                key={index}
                width={124}
                height={124}
                src={url as string}
                alt={`Media ${index + 1}`}
                className="w-32 h-32 object-cover rounded-md"
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default PoductSec;
