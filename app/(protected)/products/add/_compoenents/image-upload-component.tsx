import clsx from "clsx";
import { Label } from "@/components/ui/label";
import { CloudUpload } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export const ImageSection = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [activeImage, setActiveImage] = useState<number | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxSize: 3 * 1024 * 1024,
    maxFiles: 10,
  });

  // Debounced state update
  const debounceSetActiveImage = useCallback((index: number | null) => {
    const timeout = setTimeout(() => setActiveImage(index), 50); // Adjust delay as needed
    return () => clearTimeout(timeout);
  }, []);

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
        <p className="text-sm md:text-lg text-center">Drag and drop images, or click to select</p>
        <p className="text-sm font-medium md:text-lg">Max Size 3MB</p>
      </div>
      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative w-full h-[150px] border-4 border-gray-200 rounded-md shadow-sm cursor-pointer"
              onMouseEnter={(e) => {
                e.stopPropagation();
                setActiveImage(index);
              }}
              onMouseLeave={(e) => {
                e.stopPropagation();
                setActiveImage(null);
              }}
            >
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
