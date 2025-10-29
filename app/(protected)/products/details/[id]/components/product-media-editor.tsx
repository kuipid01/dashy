"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Pen, Save, X, Loader2, Plus } from "lucide-react";
import {
  useUpdateProductImages,
  useUploadImage
} from "@/app/(handlers)/product/product";
import { toast } from "sonner";
import { AxiosError } from "axios";

type ProductMediaEditorProps = {
  productId: string | number;
  images: (string | File)[] | undefined | null;
};

const ProductMediaEditor: React.FC<ProductMediaEditorProps> = ({
  productId,
  images
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [media, setMedia] = useState<(string | File)[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const { mutateAsync: updateProduct, isPending: updating } =
    useUpdateProductImages(productId);
  const { upload, isPending: uploading } = useUploadImage();

  useEffect(() => {
    // Initialize local state from props on mount/when product changes
    setMedia(Array.isArray(images) ? [...images] : []);
    setHasChanges(false);
  }, [images]);

  const existingUrls = useMemo(
    () => media.filter((m) => typeof m === "string") as string[],
    [media]
  );
  const newFiles = useMemo(
    () => media.filter((m) => m instanceof File) as File[],
    [media]
  );

  const handleRemove = (index: number) => {
    setMedia((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
    setHasChanges(true);
  };

  const handleFilesPicked = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const picked = Array.from(files);
    setMedia((prev) => [...prev, ...picked]);
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      let finalUrls: string[] = [...existingUrls];
      if (newFiles.length > 0) {
        const res = await upload(newFiles);
        // Assume API returns { urls: string[] }
        const uploaded = (res?.urls ?? []) as string[];
        finalUrls = [...finalUrls, ...uploaded];
      }

      await updateProduct({ image: finalUrls });
      setHasChanges(false);
      setIsEditing(false);
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        toast.error(
          e.response?.data?.error || "Failed to update product media"
        );
      }
      console.error(e);
      // noop - surface errors via toasts upstream if needed
    }
  };

  const busy = uploading || updating;

  return (
    <div className="border mt-4 p-4 rounded-lg shadow-md">
      <div className="flex mb-2 justify-between items-center">
        <p>Product Media</p>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <button
              disabled={!hasChanges || busy}
              onClick={handleSave}
              className="px-3 py-2 bg-black text-white rounded-md disabled:bg-black/50 flex items-center gap-2"
            >
              {busy ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              <span className="text-sm uppercase">Save</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-2 bg-black text-white rounded-md flex items-center gap-2"
            >
              <Pen size={16} />
              <span className="text-sm uppercase">Edit</span>
            </button>
          )}
          {isEditing && (
            <button
              disabled={busy}
              onClick={() => {
                setMedia(Array.isArray(images) ? [...images] : []);
                setHasChanges(false);
                setIsEditing(false);
              }}
              className="px-3 py-2 bg-gray-100 text-gray-800 rounded-md flex items-center gap-2"
            >
              <X size={16} />
              <span className="text-sm uppercase">Cancel</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {media.map((m, index) => {
          const preview = typeof m === "string" ? m : URL.createObjectURL(m);
          return (
            <div
              key={index}
              className="relative bg-primary border border-gray-100"
            >
              <Image
                width={124}
                height={124}
                src={preview}
                alt={`Media ${index + 1}`}
                className="w-32 h-32 object-cover rounded-md"
              />
              {isEditing && (
                <button
                  onClick={() => handleRemove(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  aria-label="Remove image"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          );
        })}
        {isEditing && (
          <label className="w-32 h-32 border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer text-sm text-gray-600">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFilesPicked(e.target.files)}
              className="hidden"
            />
            <div className="flex items-center gap-1">
              <Plus size={16} />
              Add
            </div>
          </label>
        )}
      </div>
    </div>
  );
};

export default ProductMediaEditor;
