// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useProductStore } from "@/stores/product-store";
// import { Progress } from "@/components/ui/progress";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// // import UseAi from "../../_components/use-ai";
// import { toast } from "sonner";
// import { ImageSection } from "./_compoenents/image-upload-component";
// import ProductSample from "./_compoenents/product-sample";
// import { useRouter } from "next/navigation";
// import {
//   usePublishProducts,
//   useUploadImage,
// } from "@/app/(handlers)/product/product";
// import { useFetchUserStore } from "@/app/(handlers)/auth-handlers/auth";
// import { Loader2 } from "lucide-react";
// const steps = [
//   {
//     header: "Basic Information",
//     subheader: "Enter essential product details",
//   },
//   {
//     header: "Media ",
//     subheader: "Add visuals ",
//   },
//   {
//     header: "Description of product ",
//     subheader: "Add description to help buyers",
//   },
//   {
//     header: "Inventory",
//     subheader: "Set stock quantities",
//   },
//   {
//     header: "Pricing",
//     subheader: "Define product pricing",
//   },
//   {
//     header: "Review",
//     subheader: "Confirm all details",
//   },
// ];

// export default function ProductAddition() {
//   const [addingProduct, setAddingProduct] = useState(false);
//   const [step, setStep] = useState(0);
//   const product = useProductStore((state) => state.product);
//   const updateProduct = useProductStore((state) => state.updateProduct);

//   const nextStep = () => {
//     if (
//       (step === 3 && product.image.length === 0) ||
//       product.image.length <= 1
//     ) {
//       toast.error("Please you need to upload more than one images to proceed");
//     }
//     setStep((prev) => Math.min(prev + 1, steps.length - 1));
//   };
//   const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

//   const isStepValid = () => {
//     switch (step) {
//       case 0:
//         return product.name?.length > 0 && product.category?.length > 0;
//       case 1:
//         return product.image?.length > 1;
//       case 2:
//         return product.description && product?.description?.length > 10;
//       case 3:
//         return product.stock && product?.stock >= 0;
//       case 4:
//         return product.price > 0;
//       case 5:
//         return true;
//       default:
//         return false;
//     }
//   };
//   const router = useRouter();

//   const { mutateAsync } = usePublishProducts();
//   const { store } = useFetchUserStore();
//   // console.log(store);
//   const { upload } = useUploadImage();
//   const handlePublish = async () => {
//     try {
//       setAddingProduct(true);
//       if (!store?.store?.id) {
//         toast.error("Only stores can own products");
//         setAddingProduct(false);
//         return;
//       }

//       // return;
//       if (!product) {
//         toast.error("No Product");
//         return;
//       }

//       const requiredFields = [
//         product.name,
//         product.price,
//         product.image,
//         product.description,
//         product.category,
//       ];

//       if (
//         requiredFields.some(
//           (field) => !field || (Array.isArray(field) && field.length === 0)
//         )
//       ) {
//         toast.error("Please fill in all required details");
//         return;
//       }

//       let imageUrls = product.image;

//       // Upload only the new files (skip existing URLs)
//       const newFiles = product.image.filter(
//         (file: any) => file instanceof File
//       );
//       const existingUrls = product.image.filter(
//         (file: any) => typeof file === "string"
//       );

//       if (newFiles.length > 0) {
//         try {
//           const res = await upload(newFiles); // expects return { urls: string[] }

//           if (!res?.urls || !Array.isArray(res.urls)) {
//             toast.error("Invalid upload response");
//             return;
//           }

//           imageUrls = [...existingUrls, ...res.urls];
//         } catch (err) {
//           toast.error("Upload failed");
//           console.error(err);
//           return;
//         }
//       }

//       try {
//         await mutateAsync({
//           ...product,
//           storeId: store.store.id,
//           image: imageUrls,
//         });
//         toast.success("Product published successfully");
//         localStorage.removeItem("product-storage");
//         router.push("/products");
//       } catch (err) {
//         toast.error("Publishing failed");
//         console.error(err);
//       }
//     } catch (error) {
//       toast.error("Publishing failed");
//       console.error(error);
//       setAddingProduct(false);
//     } finally {
//       setAddingProduct(false);
//     }
//   };

//   return (
//     <div className="min-h-[80vh] flex justify-center items-center bg-gray-100">
//       <div className="w-full max-w-2xl mx-4 p-4 md:p-8 bg-white border border-gray-200 rounded-2xl shadow-xl">
//         <h1 className=" text-lg md:text-xl lg:text-3xl font-bold mb-8 text-gray-800">
//           Add New Product
//         </h1>

//         <div className="mb-6">
//           <h2 className="text-xl font-semibold text-gray-800">
//             {steps[step].header}
//           </h2>
//           <p className="text-sm text-gray-500 mt-1">{steps[step].subheader}</p>
//           <Progress
//             value={(step / (steps.length - 1)) * 100}
//             className="mt-4 h-2 bg-gray-200"
//           />
//         </div>

//         <div className="space-y-6">
//           {step === 0 && (
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="product-name" className="text-gray-700">
//                   Product Name *
//                 </Label>
//                 <Input
//                   id="product-name"
//                   placeholder="Enter product name"
//                   value={product.name || ""}
//                   className="h-12 border-gray-300 focus:border-blue-500"
//                   onChange={(e) => updateProduct({ name: e.target.value })}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <div className="flex items-center justify-between">
//                   <Label htmlFor="category" className="text-gray-700">
//                     Category *
//                   </Label>

//                   {/* <UseAi onClick={() => {}} /> */}
//                 </div>

//                 <Input
//                   id="category"
//                   placeholder="Enter category"
//                   value={product.category || ""}
//                   className="h-12 border-gray-300 focus:border-blue-500"
//                   onChange={(e) => updateProduct({ category: e.target.value })}
//                 />
//               </div>
//             </div>
//           )}

//           {step === 1 && (
//             <div className="space-y-4">
//               <ImageSection />
//             </div>
//           )}
//           {step === 2 && (
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="description" className="text-gray-700">
//                   Product Description *
//                 </Label>
//                 <Textarea
//                   id="description"
//                   placeholder="Enter product description (min 20 characters)"
//                   value={product.description || ""}
//                   className="min-h-[120px] border-gray-300 focus:border-blue-500"
//                   onChange={(e) =>
//                     updateProduct({ description: e.target.value })
//                   }
//                 />
//               </div>
//             </div>
//           )}

//           {step === 3 && (
//             <div className="space-y-2">
//               <Label htmlFor="stock" className="text-gray-700">
//                 Stock Quantity{" "}
//                 <span className="text-gray-500">
//                   (How many items are available){" "}
//                 </span>{" "}
//                 *
//               </Label>
//               <Input
//                 id="stock"
//                 type="number"
//                 min="0"
//                 placeholder="Enter stock quantity"
//                 value={product.stock || ""}
//                 className="h-12 border-gray-300 focus:border-blue-500"
//                 onChange={(e) =>
//                   updateProduct({ stock: parseInt(e.target.value) || 0 })
//                 }
//               />
//             </div>
//           )}

//           {step === 4 && (
//             <div className="space-y-5">
//               <div className="space-y-2">
//                 <Label htmlFor="price" className="text-gray-700">
//                   Price ($) *
//                 </Label>
//                 <Input
//                   id="price"
//                   type="number"
//                   min="0"
//                   step="0.01"
//                   placeholder="Enter price"
//                   value={product.price || ""}
//                   className="h-12 border-gray-300 focus:border-blue-500"
//                   onChange={(e) =>
//                     updateProduct({ price: parseFloat(e.target.value) || 0 })
//                   }
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="price" className="text-gray-700">
//                   Discounted Price ($){" "}
//                   <span className="text-gray-500">
//                     (This will be the price that product would be sold.)
//                   </span>
//                 </Label>
//                 <Input
//                   id="price"
//                   type="number"
//                   min="0"
//                   step="0.01"
//                   placeholder="Enter discounted price"
//                   value={product.discounted_price || ""}
//                   className="h-12 border-gray-300 focus:border-blue-500"
//                   onChange={(e) =>
//                     updateProduct({
//                       discounted_price: parseFloat(e.target.value) || 0,
//                     })
//                   }
//                 />
//               </div>
//             </div>
//           )}

//           {step === 5 && (
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <p className="text-sm text-gray-600 mb-4">
//                 Please review your product details:
//               </p>
//               <pre className="text-sm bg-white p-4 rounded border text-gray-700 overflow-auto">
//                 <ProductSample product={product} />
//               </pre>
//             </div>
//           )}
//         </div>

//         <div className="flex justify-between mt-8">
//           <Button
//             variant="outline"
//             className="w-24 cursor-pointer border-gray-300 hover:bg-gray-100"
//             onClick={prevStep}
//             disabled={step === 0}
//           >
//             Back
//           </Button>
//           {step < steps.length - 1 ? (
//             <Button
//               disabled={!isStepValid()}
//               className="w-24 bg-black cursor-pointer  hover:bg-black/40 text-white disabled:bg-gray-400"
//               onClick={nextStep}
//             >
//               Next
//             </Button>
//           ) : (
//             <Button
//               disabled={!isStepValid() || addingProduct}
//               onClick={handlePublish}
//               className="w-24 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400"
//             >
//               {addingProduct ? (
//                 <Loader2 className="animate-spin duration-300 " />
//               ) : (
//                 "Publish"
//               )}
//             </Button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React from "react";

const page = () => {
  return <div></div>;
};

export default page;
