"use client";

import clsx from "clsx";
import { Label } from "@/components/ui/label";
import { CloudUpload, Trash2, GripVertical } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { useProductStore } from "@/stores/product-store";
import { getImageSrc } from "@/app/utils/image";
import { toast } from "sonner";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

export const ImageSection = () => {
  const { updateProduct, product } = useProductStore();
  const [activeImage, setActiveImage] = useState<number | null>(null);

  const images = React.useMemo(
    () => (Array.isArray(product.image) ? product.image : []),
    [product.image]
  );
  const videos = React.useMemo(
    () => (Array.isArray(product.videos) ? product.videos : []),
    [product.videos]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (images.length + acceptedFiles.length > 4) {
        toast.error("Maximum 4 images allowed");
        return;
      }
      // Simulate upload and get URLs (replace with real upload logic)
      const uploadedUrls = await Promise.all(
        acceptedFiles.map(async (file) => {
          // TODO: Replace this with your actual upload logic
          // For now, use a local object URL for preview
          return file;
        })
      );
      // Ensure all items are File objects
      const newImages = [...images, ...uploadedUrls].filter(
        (img): img is File => img instanceof File
      );
      updateProduct({ image: newImages });
    },
    [images, updateProduct]
  );

  const onVideoDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Simulate upload and get URLs (replace with real upload logic)
      const uploadedUrls = await Promise.all(
        acceptedFiles.map(async (file) => {
          // TODO: Replace this with your actual upload logic
          // For now, use a local object URL for preview
          return file;
        })
      );
      // Ensure all items are File objects (or change to string if needed)
      const newVideos = [...videos, ...uploadedUrls].filter(
        (v): v is File => v instanceof File
      );
      updateProduct({ videos: newVideos });
    },
    [videos, updateProduct]
  );

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from<File>(
      images.filter((img): img is File => img instanceof File)
    );
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    updateProduct({ image: reordered });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxSize: 3 * 1024 * 1024,
    maxFiles: 4 - images.length,
  });

  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } =
    useDropzone({
      onDrop: onVideoDrop,
      accept: { "video/*": [] },
      maxSize: 10 * 1024 * 1024,
      maxFiles: 1,
    });

  return (
    <div className="space-y-6">
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
            Drag and drop images, or click to select (Max 4)
          </p>
          <p className="text-sm font-medium md:text-lg">Max Size 3MB</p>
        </div>

        {images.length > 0 && (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="images" direction="horizontal">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3"
                >
                  {images.map((file, index) => (
                    <Draggable
                      key={index.toString()}
                      draggableId={index.toString()}
                      index={index}
                    >
                      {(draggableProvided) => (
                        <div
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                          {...draggableProvided.dragHandleProps}
                          className="relative w-full h-[150px] border-4 border-gray-200 rounded-md shadow-sm"
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
                              onClick={(e) => {
                                e.stopPropagation();
                                const updated = images
                                  .filter((_, i) => i !== index)
                                  .filter(
                                    (img): img is File => img instanceof File
                                  );
                                updateProduct({ image: updated });
                                toast.success("Image removed successfully");
                              }}
                              className="absolute right-3 top-3 cursor-pointer text-white w-5 h-5"
                            />
                            <GripVertical className="absolute left-3 top-3 text-white w-4 h-4" />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      <div>
        <Label htmlFor="video" className="text-gray-700">
          Product Videos{" "}
          <span className="text-gray-500 text-sm">(Optional)</span>
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
          yarn dev
          <p className="text-sm font-medium md:text-lg">Max Size 10MB</p>
        </div>

        {videos.length > 0 && (
          <div className="mt-4">
            <video
              src={
                typeof videos[0] === "string"
                  ? videos[0]
                  : URL.createObjectURL(videos[0])
              }
              controls
              className="w-full h-64 rounded-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};
