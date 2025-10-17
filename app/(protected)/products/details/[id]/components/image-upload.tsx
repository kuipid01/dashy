/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  images: string | string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
  setFormData: (data: any) => void;
  formData: any;
  isUploading: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 5,
  className = "",
  setFormData,
  formData,
  isUploading
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ Normalize images into an array for consistent logic
  const imageArray =
    typeof images === "string" && images.length > 0
      ? images.split(",").filter(Boolean)
      : Array.isArray(images)
      ? images
      : [];

  // ✅ When files are selected
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;
    console.log(formData, "fomdara");
    // Update the local formData with the new files
    setFormData((prev: any) => ({
      ...prev,
      ImageFiles: [...(prev.ImageFiles || []), ...Array.from(files)]
    }));

    const newImages: string[] = [];
    const remainingSlots = maxImages - imageArray.length;

    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          newImages.push(result);

          // When all previews are ready, update state
          if (newImages.length === Math.min(files.length, remainingSlots)) {
            onImagesChange([...imageArray, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // ✅ Remove an image by index
  const handleRemoveImage = (index: number) => {
    if (index === undefined) return;

    const updatedImages = [...imageArray];
    updatedImages.splice(index, 1);

    // Update both formData and parent
    setFormData((prev: any) => ({
      ...prev,
      Images: updatedImages.join(",")
    }));

    onImagesChange(updatedImages);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const canAddMore = imageArray.length < maxImages;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Variant Images
        </label>
        <span className="text-xs text-gray-500">
          {imageArray.length}/{maxImages} images
        </span>
      </div>

      {/* Upload Button */}
      {canAddMore && (
        <div
          onClick={handleUploadClick}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 cursor-pointer transition-colors"
        >
          <Upload className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">Click to upload images</p>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Image Preview Grid */}
      {imageArray.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {imageArray.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <Image
                  width={100}
                  height={100}
                  src={image}
                  alt={`Variant image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Status */}
      {isUploading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="animate-spin h-5 w-5 text-gray-400 mr-2" />
          <span className="text-sm text-gray-600">Uploading images...</span>
        </div>
      )}

      {/* Empty State */}
      {imageArray.length === 0 && !isUploading && (
        <div className="text-center py-8 text-gray-500">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2 text-sm">No images uploaded yet</p>
          <p className="text-xs text-gray-400">
            Upload images to showcase this variant
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
