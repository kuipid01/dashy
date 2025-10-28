/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import {
  Upload,
  Store,
  Package,
  Sparkles,
  ImagePlus,
  Trash
} from "lucide-react";
import { Confetti } from "./confettin";
import { ProgressIndicator } from "./progress-indicator";
import {
  usePublishProducts,
  usePublishProductsShort,
  useUploadImage
} from "@/app/(handlers)/product/product";
import { toast } from "sonner";
import { useFetchUserStore } from "@/app/(handlers)/auth-handlers/auth";
import { useRouter } from "next/navigation";
import {
  useCheckStoreName,
  useUpdateStore
} from "@/app/(handlers)/store/store";
import clsx from "clsx";
import { useUpdateUserOnboardingStatus } from "@/app/(handlers)/user/user";

interface ProductData {
  name: string;
  description: string;
  price: string;
  image: File | null;
}

interface StoreData {
  name: string;
  logo: File | null;
}

export function OnboardingFlow() {
  const router = useRouter();
  const { upload } = useUploadImage();
  const [addingProduct, setAddingProduct] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    images: [] as File[]
  });

  const { store } = useFetchUserStore();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProductData({
        ...productData,
        images: [...productData.images, ...Array.from(e.target.files)]
      });
    }
  };
  const isFormValid = () => {
    return (
      productData.images.length > 0 &&
      productData.name.trim() !== "" &&
      productData.category.trim() !== "" &&
      productData.description.trim() !== "" &&
      productData.price.trim() !== ""
    );
  };
  const [storeData, setStoreData] = useState<StoreData>({
    name: "",
    logo: null
  });

  const [debouncedName, setdebouncedName] = useState("");
  const totalSteps = 5;

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const nextStep = () => {
    console.log("true");
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const skipStep = () => {
    nextStep();
  };
  const { mutateAsync: updateStatus, isPending: isAdding } =
    useUpdateUserOnboardingStatus();
  const { mutateAsync } = usePublishProductsShort();
  const [nameValid, setNameValid] = useState(false);
  const { mutateAsync: checkName, isPending: checking } = useCheckStoreName();
  const { mutateAsync: updatestore, isPending: updatingStore } =
    useUpdateStore();
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setdebouncedName(storeData.name);
    }, 500);

    return () => {
      clearTimeout(timeOut);
    };
  }, [storeData.name]);

  useEffect(() => {
    if (debouncedName.length < 4) {
      return;
    }
    if (!debouncedName) {
      setNameValid(false);
      return;
    }

    const check = async () => {
      try {
        const res = await checkName(debouncedName); // Await the API call

        setNameValid(true);
      } catch (error) {
        setNameValid(false);
        console.log(error);
      }
    };

    check();
  }, [debouncedName, checkName]);

  const handlePublish = async () => {
    try {
      setAddingProduct(true);

      if (!store?.store?.id) {
        toast.error("Only stores can own products");
        return;
      }

      const { images, price, ...rest } = productData;

      // Validate required fields
      if (!productData.name || !price || !productData.description) {
        toast.error("Please fill in all required details");
        return;
      }

      // Validate images
      if (!images || images.length === 0) {
        toast.error("Please add at least one image");
        return;
      }

      for (let index = 0; index < images.length; index++) {
        if (
          images[index] instanceof File &&
          images[index].size > 5 * 1024 * 1024
        ) {
          toast.error(`Image #${index + 1} is too large (max 5MB)`);
          return;
        }
      }

      // Separate new files and existing URLs
      const newFiles = images.filter((file: any) => file instanceof File);
      const existingUrls = images.filter(
        (file: any) => typeof file === "string"
      );

      let imageUrls: File[] = [...existingUrls];

      if (newFiles.length > 0) {
        try {
          const res = await upload(newFiles); // expects { urls: string[] }
          if (!res?.urls || !Array.isArray(res.urls)) {
            toast.error("Invalid upload response");
            return;
          }
          imageUrls = [...existingUrls, ...res.urls];
        } catch (err) {
          toast.error("Upload failed");
          console.error(err);
          return;
        }
      }

      // Validate price
      const numericPrice = Number(price);
      if (isNaN(numericPrice)) {
        toast.error("Price must be a valid number");
        return;
      }

      // Final submit
      await mutateAsync({
        ...rest,
        price: numericPrice,
        storeId: store.store.id,
        image: imageUrls
      });

      triggerConfetti();
      nextStep();
    } catch (error) {
      toast.error("Publishing failed");
      console.error(error);
    } finally {
      setAddingProduct(false);
    }
  };
  const handleRemoveImage = (file: File) => {
    setProductData((prev) => ({
      ...prev,
      images: prev.images.filter((image) => image.name !== file.name)
    }));
  };

  const handleStoreSave = async () => {
    try {
      await updatestore({
        name: storeData.name
      });
      triggerConfetti();
      nextStep();
    } catch (error) {
      toast.error("Couldnt update store , sorry , try again or skip!!");
    }
  };

  const handleImageUpload = async () => {
    if (!storeData.logo) {
      toast.error("Please select an image to upload");
      return;
    }

    try {
      const image = storeData.logo;

      // Upload the new image
      const res = await upload([image]); // expects { urls: string[] }

      if (!res?.urls || !Array.isArray(res.urls) || res.urls.length === 0) {
        toast.error("Invalid upload response");
        return;
      }

      // Merge with existing URLs
      const imageUrl = [...res.urls];

      // Update store with the first image as logo
      await updatestore({ store_logo: imageUrl[0] });

      toast.success("Logo updated successfully");

      // Trigger confetti and go to next step
      triggerConfetti();
      setTimeout(nextStep, 1500);
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error("Upload failed. Please try again.");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card className="w-full bg-[#f8f5ed] max-w-md mx-auto bounce-in">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">🎉 Welcome!</CardTitle>
              <p className="text-muted-foreground">
                Let&#39;s get your store up and running. This will only take a
                minute, and you can skip anytime.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={nextStep}
                className="w-full cursor-pointer bg-[#ffc91c] hover:bg-[#ffc91c]/60 text-black"
                size="lg"
              >
                Let&lsquo;s go
              </Button>
              {/* <Button
                className="w-full cursor-pointer bg-[#f8f5ed] hover:bg-[#f8f5ed]/60  border-black  border text-black"
                onClick={skipStep}
                variant="ghost"
              >
                Skip
              </Button> */}
            </CardContent>
          </Card>
        );

      case 1:
        return (
          <Card className="w-full bg-primary border max-h-[85vh] overflow-y-auto shadow border-black max-w-xl mx-auto slide-in">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Package className="w-8 h-8 text-black" />
              </div>
              <CardTitle className="text-xl font-bold">
                Add your first product
              </CardTitle>
              <p className="text-muted-foreground">
                Show off what you&#39;re selling and make a great first
                impression.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product-name">Product Name</Label>
                <Input
                  id="product-name"
                  placeholder="Amazing Product"
                  className="border border-black"
                  value={productData.name}
                  onChange={(e) =>
                    setProductData({ ...productData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-name">Product Category</Label>
                <Input
                  id="product-category"
                  placeholder="Shirts"
                  className="border border-black"
                  value={productData.category}
                  onChange={(e) =>
                    setProductData({ ...productData, category: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-description">Description</Label>
                <Textarea
                  id="product-description"
                  className="border border-black"
                  placeholder="Tell customers about your product..."
                  value={productData.description}
                  onChange={(e) =>
                    setProductData({
                      ...productData,
                      description: e.target.value
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-price">Price</Label>
                <Input
                  className="border border-black"
                  id="product-price"
                  placeholder="$29.99"
                  value={productData.price}
                  onChange={(e) =>
                    setProductData({ ...productData, price: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Product Images</Label>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border border-black"
                />
                {productData.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {productData.images.map((img, idx) => (
                      <div className=" relative" key={idx}>
                        <img
                          key={idx}
                          src={URL.createObjectURL(img)}
                          alt="preview"
                          className="w-20 h-20 object-cover relative rounded border"
                        />
                        <div
                          onClick={() => {
                            handleRemoveImage(img);
                          }}
                          className=" bg-white cursor-pointer absolute bottom-3 right-2 rounded-md p-1 grid place-items-center"
                        >
                          <Trash
                            size={14}
                            className="   text-red-600  hover:text-red-300"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-2">
                <Button
                  onClick={handlePublish}
                  disabled={addingProduct || !isFormValid()}
                  className="w-full disabled:bg-[#ffc91c]/30 cursor-pointer bg-[#ffc91c] hover:bg-[#ffc91c]/60 text-black"
                  size="lg"
                >
                  {addingProduct ? "Saving..." : "Save Product"}
                </Button>
                {/* <Button
                  className="w-full cursor-pointer bg-[#f8f5ed] hover:bg-[#f8f5ed]/60 border-black border text-black"
                  onClick={skipStep}
                  variant="ghost"
                >
                  Skip
                </Button> */}
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="w-full bg-primary border max-h-[85vh] overflow-y-auto shadow border-black max-w-xl mx-auto slide-in">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Store className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl font-bold">
                What&lsquo;s your store called?
              </CardTitle>
              <p className="text-muted-foreground">
                Choose a name that represents your brand.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="store-name">Store Name</Label>
                <Input
                  id="store-name"
                  placeholder="My Awesome Store"
                  className={clsx(
                    "border border-black",
                    nameValid ? "border-green-400 " : "border-red-300"
                  )}
                  value={storeData.name}
                  onChange={(e) => {
                    const formattedName = e.target.value.replace(/\s+/g, "-");
                    setStoreData({ ...storeData, name: formattedName });
                  }}
                />
              </div>
              {storeData.name && (
                <div className="p-4 bg-gray-500 rounded-lg">
                  <p className="text-sm text-gray-200 mb-2">Preview:</p>
                  <p className="font-semibold text-lg">{storeData.name}</p>
                </div>
              )}
              <div className="space-y-4">
                <Button
                  onClick={handleStoreSave}
                  disabled={!nameValid || checking}
                  className="w-full disabled:bg-[#ffc91c]/30 cursor-pointer bg-[#ffc91c] hover:bg-[#ffc91c]/60 text-black"
                  size="lg"
                >
                  {addingProduct ? "Saving..." : "Update Store Name"}
                </Button>
                {/* <Button
                  className="w-full cursor-pointer bg-[#f8f5ed] hover:bg-[#f8f5ed]/60 border-black border text-black"
                  onClick={skipStep}
                  variant="ghost"
                >
                  Skip
                </Button> */}
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="w-full bg-primary border max-h-[85vh] overflow-y-auto shadow border-black max-w-xl mx-auto slide-in">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl font-bold">
                Add a logo or image
              </CardTitle>
              <p className="text-muted-foreground">
                Make your store memorable with a great visual.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload area */}
              <label
                htmlFor="store-logo"
                className="block cursor-pointer border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-primary/5 transition"
              >
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag & drop your logo here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  (Only one image allowed)
                </p>
                <input
                  type="file"
                  id="store-logo"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setStoreData({ ...storeData, logo: e.target.files[0] });
                    }
                  }}
                />
              </label>

              {/* Preview */}
              {storeData.logo && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={URL.createObjectURL(storeData.logo)}
                    alt="preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}

              {/* Action buttons */}
              <div className="space-y-4">
                <Button
                  onClick={handleImageUpload}
                  disabled={!storeData.logo || updatingStore}
                  className="w-full disabled:bg-[#ffc91c]/30 cursor-pointer bg-[#ffc91c] hover:bg-[#ffc91c]/60 text-black"
                  size="lg"
                >
                  {updatingStore ? "Saving..." : "Update Store Logo"}
                </Button>
                {/* <Button
                  className="w-full cursor-pointer bg-[#f8f5ed] hover:bg-[#f8f5ed]/60 border-black border text-black"
                  onClick={async () => {
                    try {
                      await updateStatus(true);
                      triggerConfetti();
                      router.push("/dashboard");
                    } catch (error) {
                      console.log(error);
                      toast.error("Couldnt toggle status");
                    }
                  }}
                  variant="ghost"
                >
                  Skip
                </Button> */}
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="w-full bg-primary border max-h-[85vh] overflow-y-auto shadow border-black max-w-xl mx-auto slide-in">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-black" />
              </div>
              <CardTitle className="text-2xl font-bold">
                ✨ You&lsquo;re all set!
              </CardTitle>
              <p className="text-muted-foreground">
                Your store is ready to go. Time to start selling!
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <h3 className="font-semibold mb-2">
                  What you&lsquo;ve accomplished:
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {productData.name && <li>✓ Added your first product</li>}
                  {storeData.name && <li>✓ Named your store</li>}
                  <li>✓ Set up your store foundation</li>
                </ul>
              </div>
              <Button
                onClick={async () => {
                  try {
                    await updateStatus(true);
                    triggerConfetti();
                    router.push("/dashboard");
                  } catch (error) {
                    console.log(error);
                    toast.error("Couldnt toggle status");
                  }
                }}
                disabled={isAdding}
                className="w-full disabled:bg-[#ffc91c]/30 cursor-pointer bg-[#ffc91c] hover:bg-[#ffc91c]/60 text-black"
                size="lg"
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-stone-500 to-stone-700 fixed top-0 left-0 right-0 bottom-0 z-[10000] flex items-center justify-center p-4">
      <Confetti active={showConfetti} />
      <div className="w-full max-w-2xl">
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
        {renderStep()}
      </div>
    </div>
  );
}
