/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Check, Loader2 } from "lucide-react";
import { ProductVariant } from "@/constants/types";
import {
  useCreateVariant,
  useDeleteProductVariant,
  UseFetchProductVariants,
  useUpdateVariant
} from "@/app/(handlers)/general/general";
import { toast } from "sonner";
import {
  useGetCurrentProduct,
  useUploadImage
} from "@/app/(handlers)/product/product";
import ImageUpload from "./image-upload";
import Image from "next/image";

const ProductVariantManager = ({ productId }: { productId: number }) => {
  const { data: variantsDb, isLoading: variantsLoading } =
    UseFetchProductVariants(productId ?? 0);

  const { isPending: deleting, mutateAsync: deleteVariant } =
    useDeleteProductVariant();
  // console.log(variantsDb, "db for variant")
  const { product, isLoading } = useGetCurrentProduct(productId);
  const { mutateAsync: addVariant, isPending } = useCreateVariant();
  const { isPending: updating, mutateAsync: updateVariant } =
    useUpdateVariant();
  const [variants, setVariants] = useState<
    (ProductVariant | Omit<ProductVariant, "ID">)[]
  >([]);
  console.log(variants, "variants");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVariant, setEditingVariant] = useState<any>(null);
  const [variantTypes, setVariantTypes] = useState([
    "Size",
    "Color",
    "Material",
    "Dimensions",
    "Weight"
  ]);
  const { upload, isPending: uploading } = useUploadImage();
  const [newVariantType, setNewVariantType] = useState("");
  const [formData, setFormData] = useState<Omit<ProductVariant, "ID">>({
    Size: "",
    Color: "",
    Material: "",
    Weight: 0,
    Dimensions: "",
    SKU: "",
    Stock: 0,
    Price: 0,
    VariantId: "",
    Images: [],
    ImageFiles: []
  });

  // Mock data for demonstration
  useEffect(() => {
    if (!variantsDb) return;
    setVariants([...variantsDb]);
  }, [variantsDb]);

  const resetForm = () => {
    const emptyForm: Omit<ProductVariant, "ID"> = {
      Sku: "",
      Stock: 0,
      Price: 0,
      Weight: 0,
      Images: [],
      ImageFiles: []
    };
    variantTypes.forEach((type) => {
      emptyForm[type] = "";
    });
    setFormData(emptyForm);
  };

  // const handleAddVariantType = () => {
  //     if (newVariantType.trim() && !variantTypes.includes(newVariantType.toLowerCase())) {
  //         const newType = newVariantType.toLowerCase();
  //         setVariantTypes([...variantTypes, newType]);
  //         setFormData(prev => ({ ...prev, [newType]: '' }));
  //         setNewVariantType('');
  //     }
  // };

  const handleRemoveVariantType = (typeToRemove: string) => {
    if (variantTypes.length > 1) {
      setVariantTypes(variantTypes.filter((type) => type !== typeToRemove));
      const newFormData = { ...formData };
      delete newFormData[typeToRemove];
      setFormData(newFormData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    console.log(field, value);
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSubmit = async () => {
    try {
      if (editingVariant && !editingVariant.id) {
        console.log(editingVariant, "editingVariant");
        toast.error(
          "You cannot edit a new variant that is not in the database"
        );
        return;
      }
      // Step 1: Clean formData once
      const cleanedFormData = Object.entries(formData).reduce(
        (acc, [key, value]) => {
          if (value !== "" && value !== null && value !== undefined) {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, any>
      );
      if (formData.ImageFiles.length > 0) {
        const newFiles = formData.ImageFiles.filter(
          (file: any) => file instanceof File
        );
        const existingUrls = formData.ImageFiles.filter(
          (file: any) => typeof file === "string"
        );
        const res = await upload(newFiles);
        console.log(formData.Images, "formData.Images.split(", ").toString(),");
        formData.Images = [...existingUrls, ...res.urls];
      }
      const baseVariant: Omit<ProductVariant, "ID"> = {
        Product_id: productId,
        ...cleanedFormData,
        Stock: parseInt(formData.Stock as any) || 0,
        Price: parseFloat(formData.Price as any) || 0,
        Weight: parseFloat(formData.Weight as any) || 0,
        Images: formData.Images.toString()
      };
      console.log("Base Variant", baseVariant);
      if (!baseVariant.Price || !baseVariant.Stock || !baseVariant.Product_id) {
        toast.error("Fill in all necessary fields");
        return;
      }

      const hasAtLeastOneTypeValue = variantTypes.some(
        (type) =>
          baseVariant[type] && baseVariant[type].toString().trim() !== ""
      );

      if (!hasAtLeastOneTypeValue) {
        toast.error("At least one variant type value is required");
        return;
      }

      const isValid = validateStock(baseVariant.Stock);
      if (!isValid) {
        toast.error("Stock exceeds total product quantity");
        return;
      }

      if (editingVariant) {
        console.log("Editing", editingVariant);
        const updatedVariant: Record<string, any> = {
          ...baseVariant,
          VariantId: editingVariant.id
        };

        // setVariants(variants.map((v) =>
        //     v.VariantId === editingVariant.VariantId ? updatedVariant : v
        // ));

        const previousVariants = [...variants];
        try {
          console.log(variants, updatedVariant);
          // return
          await updateVariant(updatedVariant);

          const replacePayload = {
            ...updatedVariant,
            stock: updatedVariant.Stock,
            sku: updatedVariant.SKU,
            size: updatedVariant.Size,
            material: updatedVariant.Material,
            color: updatedVariant.Color,
            price: updatedVariant.Price,
            weight: updatedVariant.Weight,
            images: updatedVariant.Images.toString()
          };
          setVariants(
            variants.map((v) =>
              v.id === updatedVariant.VariantId ? replacePayload : v
            )
          );
          setEditingVariant(null);
          toast.success("Variant Updated");
        } catch (error) {
          setVariants(previousVariants);
        }
      } else {
        const previousVariants = [...variants];
        console.log(baseVariant);
        const replacePayload = {
          ...baseVariant,
          stock: baseVariant.Stock,
          sku: baseVariant.SKU,
          size: baseVariant.Size,
          material: baseVariant.Material,
          color: baseVariant.Color,
          price: baseVariant.Price,
          weight: baseVariant.Weight,
          images: baseVariant.Images.toString()
        };
        setVariants([...variants, replacePayload]);

        try {
          await addVariant(baseVariant);
          toast.success("Variant Added");
          setShowAddForm(false);
        } catch (error) {
          console.error("Error adding variant:", error);
          setVariants(previousVariants);
          toast.error("Failed to add variant");
        }
      }

      resetForm();
    } catch (error) {
      console.error("Error submitting variant:", error);
    }
  };

  const validateStock = (stock: number): boolean => {
    if (!product || typeof product.stock !== "number") return false;

    const totalStockInVariants = variants.reduce(
      (sum, variant: Omit<ProductVariant, "ID">) => sum + (variant.Stock || 0),
      0
    );

    if (stock + totalStockInVariants > product.stock) {
      toast.error("Stock exceeds total product quantity");
      return false;
    }

    return true;
  };

  const handleEdit = (variant: any) => {
    const mappedFormData = {
      Size: variant.size || "",
      Color: variant.color || "",
      Material: variant.material || "",
      Weight: variant.weight || 0,
      Dimensions: variant.dimensions || "",
      SKU: variant.sku || "",
      Stock: variant.stock || 0,
      Price: variant.price || 0,
      VariantId: variant.id,
      Images: variant.images || [],
      ImageFiles: []
    };

    setEditingVariant(variant);
    setFormData(mappedFormData);
    setShowAddForm(false);
  };

  const handleDelete = async (variantId: any) => {
    if (window.confirm("Are you sure you want to delete this variant?")) {
      try {
        await deleteVariant(variantId);
        toast.success("✔✔");
        setVariants(variants.filter((v: any) => v.id !== variantId));
      } catch (error) {
        toast.error("Failed To Delete Variant");
      }
    }
  };

  const handleCancel = () => {
    setEditingVariant(null);
    setShowAddForm(false);
    resetForm();
  };

  const generateSKU = () => {
    const variantParts = variantTypes
      .filter((type) => formData[type])
      .map((type) => formData[type].toUpperCase())
      .join("-");

    if (!variantParts) return toast.error("No Variant");

    const sku = variantParts ? `PROD-${variantParts}` : "";
    console.log(sku);
    setFormData((prev) => ({ ...prev, SKU: sku }));
  };

  const noValue = Object.values(formData).every(
    (value) => value === "" || value === null || value === undefined
  );

  return (
    <div className=" max-w-full lg:max-w-8xl mx-auto p-2 md:p-4 lg:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="lg:text-2xl text-xl font-bold text-gray-900">
          Product Variants
        </h1>
        <button
          disabled={isPending || updating}
          onClick={() => {
            setShowAddForm(true);
            setEditingVariant(null);
            resetForm();
          }}
          className="bg-black flex-nowrap text-nowrap text-white px-3 py-2 rounded-md hover:bg-black/80 flex items-center gap-2"
        >
          <Plus size={16} />
          Add Variant
        </button>
      </div>

      {/* Add/Edit Form */}
      {/* {(showAddForm || editingVariant) && (
                <VariantForm isEditing={!!editingVariant} />
            )} */}
      {(showAddForm || editingVariant) && (
        <div className="bg-white border-2 border-gray-200 rounded-lg p-2 md:p-4 lg:p-6 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {!!editingVariant ? "Edit Variant" : "Add New Variant"}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Dynamic Variant Type Fields */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {variantTypes.map((type) => (
                <div key={type} className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {type}
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={formData[type] ?? ""}
                      onChange={(e) => handleInputChange(type, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder={`Enter ${type}`}
                    />
                    {variantTypes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveVariantType(type)}
                        className="px-2 py-2 bg-red-500 text-white rounded-r-md hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Variant Type */}

            {/* SKU, Stock, Price Fields */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU
                </label>
                <div
                  className="flex flex-col sm:flex-row gap-2
                 sm:gap-0"
                >
                  <input
                    type="text"
                    value={formData.SKU || ""}
                    onChange={(e) => handleInputChange("SKU", e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Product SKU"
                  />
                  <button
                    onClick={generateSKU}
                    className="px-3 py-2 cursor-pointer bg-black text-white rounded-md sm:rounded-r-md hover:bg-black/80 text-sm"
                  >
                    Auto
                  </button>
                </div>
              </div>
              <div className="grid   grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={formData.Stock || ""}
                    onChange={(e) => handleInputChange("Stock", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₦)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.Price || ""}
                    onChange={(e) => handleInputChange("Price", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="0.00"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="mt-6">
              <ImageUpload
                images={formData.Images || []}
                onImagesChange={(images) =>
                  setFormData((prev) => ({ ...prev, Images: images }))
                }
                formData={formData}
                setFormData={setFormData}
                maxImages={5}
                isUploading={
                  (isPending || updating || uploading) &&
                  formData.ImageFiles.length > 0
                }
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                disabled={isPending || updating || uploading}
                onClick={handleSubmit}
                className="px-4 disabled:bg-black/80 py-2 bg-black text-white rounded-md hover:bg-black/80 flex items-center gap-2"
              >
                {isPending || updating || uploading ? (
                  <Loader2 className="animate-spin duration-300" />
                ) : (
                  <Save size={16} />
                )}
                {!!editingVariant ? "Update" : "Add"} Variant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Variants Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                {variantTypes.map((type) => (
                  <th
                    key={type}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {type}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Images
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {variants.map((variant: any) => (
                <tr key={variant.id} className="hover:bg-gray-50">
                  {variantTypes.map((type) => (
                    <td
                      key={type}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {variant[type.toLowerCase()] || "-"}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {variant?.sku || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        variant.stock === 0
                          ? "bg-red-100 text-red-800"
                          : variant?.stock < 10
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {variant?.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₦{variant?.price?.toFixed(2) || "0.00"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex -space-x-2">
                      {variant?.images &&
                      variant.images.split(",").length > 0 ? (
                        variant.images
                          .split(",")
                          .slice(0, 3)
                          .map((image: string, index: number) => (
                            <div key={index} className="relative">
                              <Image
                                width={32}
                                height={32}
                                src={image}
                                alt={`Variant ${index + 1}`}
                                className="w-8 h-8 rounded-full border-2 border-white object-cover"
                              />
                            </div>
                          ))
                      ) : (
                        <span className="text-gray-400 text-xs">No images</span>
                      )}
                      {variant?.images &&
                        variant.images.split(",").length > 3 && (
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                            +{variant.images.split(",").length - 3}
                          </div>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(variant)}
                        className="text-black/80 hover:text-blue-900"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(variant.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {variants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No variants added yet.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-2 text-black hover:text-blue-700"
            >
              Add your first variant
            </button>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900">Total Variants</h3>
          <p className="text-2xl font-bold text-black/80">{variants.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-900">Total Stock</h3>
          <p className="text-2xl font-bold text-green-600">
            {variants.reduce((sum: any, v: any) => sum + (v.stock || 0), 0)}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-900">Low Stock</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {variants.filter((v: any) => v.stock < 10).length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductVariantManager;
