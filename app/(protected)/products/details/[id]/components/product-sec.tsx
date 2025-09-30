/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import {
  useGetCurrentProduct,
  useUpdateProduct
} from "@/app/(handlers)/product/product";
import { InputComponent } from "@/app/(protected)/_components/input-component";
import Newbtn from "@/app/(protected)/_components/new-black-btn";
import UseAi from "@/app/(protected)/_components/use-ai";
import { mockProducts } from "@/constants/mock_data";
import { cn } from "@/lib/utils";
// import { Product } from "@/stores/product-store";
import { Loader2, Pen, SaveAll } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useFetchUserStore } from "@/app/(handlers)/auth-handlers/auth";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import Back from "@/app/components/reusables/back";
const PoductSec = () => {
  // You need to get the product id from somewhere, e.g. from the router params
  // For Next.js 13+ with app router, you can use useParams from 'next/navigation'

  const params = useParams();

  const id = params?.id as string;
  const { mutateAsync, isPending } = useUpdateProduct(id);
  const { store, isLoading: fetchingsTore } = useFetchUserStore();
  const { product, isLoading } = useGetCurrentProduct(id);
  const [formState, setFormState] = useState<any>({});
  const [active, setActive] = useState(false);
  useEffect(() => {
    const getStatus = async () => {
      if (product) {
        setActive(product.live);
      }
    };
    getStatus();
  }, [product]);

  console.log(active, "active state");
  // const product: Product = {
  //   name: "Sample Product",
  //   description: "This is a great product that does amazing things.",
  //   price: 99,
  //   category: "NA",
  //   image: ["/assets/login.jpg", "/assets/login.jpg", "/assets/login.jpg"],
  //   videos: [],
  //   stock: 1,
  //   discountedPrice: 0,
  //   rating: 3
  // };

  const handleChange = (key: string, value: any) => {
    setFormState((prev: any) => ({ ...prev, [key]: value }));
  };

  const [canBeEdited, setCanBeEdited] = useState(false);
  //   const [editi, setediti] = useState(second)
  //   const disabled = true;

  const handlePublish = async () => {
    if (!product) {
      toast.error("No product found");
      return;
    }

    if (Object.keys(formState).length === 0) {
      toast.info("No changes to save");
      return;
    }

    try {
      const payload = { ...product, storeId: store.store.id, ...formState };
      await mutateAsync(payload);
      toast.success("Product updated successfully");
      setCanBeEdited(false);
      setFormState({});
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update product");
    }
  };

  const handleToggle = async (checked: boolean) => {
    setActive(checked);
    const payload = {
      ...product,
      live: checked,
      storeId: store.store.id,
      ...formState
    };
    await mutateAsync(payload);
    toast.success("Product updated successfully");
  };
  return (
    <>
      <Back />
      <div className=" w-full  flex justify-between items-center">
        <div className="flex flex-col">
          <p className="text-sm font-medium">Product State</p>
          <p className="text-xs  font-bold uppercase ounded-md">
            {active
              ? "This product is active and visible to users."
              : "This product is inactive and hidden from users."}
          </p>
          <div className="mt-2">
            <Badge
              variant={active ? "secondary" : "destructive"}
              className="px-3 py-1 rounded-full"
            >
              {active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
        <div>
          <Switch
            checked={active}
            onCheckedChange={handleToggle}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="border p-4 max-h-fit rounded-lg shadow-md">
        <div className="flex mb-2 justify-between items-center">
          <p>Product Details</p>

          {/* Switch */}

          <Newbtn
            onClick={async () => {
              if (canBeEdited) {
                const result = await handlePublish();
                if (!isPending) {
                  setCanBeEdited(false);
                }
              } else {
                setCanBeEdited(true);
              }
            }}
          >
            {canBeEdited ? (
              <div className="flex items-center gap-1">
                <SaveAll size={16} />
                {isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <span className="text-sm uppercase">Save</span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Pen size={16} />
                <span className="text-sm uppercase">Edit</span>
              </div>
            )}
          </Newbtn>
        </div>
        {isLoading ? (
          <div className=" flex justify-center items-center w-full h-full min-h-[500px]">
            <Loader2 className=" animate-spin duration-300" />
          </div>
        ) : (
          <>
            <div className="grid border-t border-gray-200 pt-3 gap-3 grid-cols-1">
              <InputComponent
                label="Product Name"
                name="Product Name"
                defaultValue={product?.name}
                disabled={!canBeEdited}
                onChange={(e) => handleChange("name", e.target.value)}
              />

              <InputComponent
                label="Product Category"
                name="Product Category"
                defaultValue={product?.category}
                disabled={!canBeEdited}
                onChange={(e) => handleChange("category", e.target.value)}
              />

              <div className="grid grid-cols-3 gap-3 ">
                <InputComponent
                  label="Product Price"
                  name="Product Price"
                  type="number"
                  defaultValue={product?.price}
                  disabled={!canBeEdited}
                  onChange={(e) =>
                    handleChange("price", parseFloat(e.target.value) || 0)
                  }
                />
                <InputComponent
                  label=" Discount Price"
                  name="Product Discount Price"
                  type="number"
                  defaultValue={product?.discounted_price || 0}
                  disabled={!canBeEdited}
                  onChange={(e) =>
                    handleChange(
                      "discounted_price",
                      parseFloat(e.target.value) || 0
                    )
                  }
                />
                <InputComponent
                  label=" Stock Quantity"
                  name="Product Stock"
                  type="number"
                  defaultValue={product?.stock ?? 0}
                  disabled={!canBeEdited}
                  onChange={(e) =>
                    handleChange("stock", parseInt(e.target.value) || 0)
                  }
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
                defaultValue={product?.description ?? ""}
                onChange={(e) => handleChange("description", e.target.value)}
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
                    <div>
                      <SaveAll size={16} />{" "}
                      <span className=" text-sm uppercase">
                        {isPending ? (
                          <Loader2 className="animate-spin  duration-300" />
                        ) : (
                          "Save"
                        )}
                      </span>
                    </div>
                  ) : (
                    <>
                      <Pen size={16} />{" "}
                      <span className=" text-sm uppercase">Edit</span>
                    </>
                  )}
                </Newbtn>
              </div>
              <div className="flex gap-4">
                {product?.image?.map((url, index) => (
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
          </>
        )}
      </div>
    </>
  );
};

export default PoductSec;
