import { ProductVariant } from "@/constants/types";
import clsx from "clsx";
import React from "react";

const VariantsCorner = ({
  setSelectedVariantNew,
  selectedVariantNew,
  variants,
}: {
  selectedVariantNew: ProductVariant | null;
  setSelectedVariantNew: React.Dispatch<
    React.SetStateAction<ProductVariant | null>
  >;
  variants: ProductVariant[] | undefined;
}) => {
  const excludedKeys = [
    "id",
    "ID",
    "product_id",
    "created_at",
    "updated_at",
    "product",
    "price",
    "stock",
    "sku",
    "images"
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-700">Available Variants</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {variants?.map((variant, i) => (
          <button
            key={variant.id}
            onClick={() => setSelectedVariantNew(variant)}
            className={clsx(
              "py-2 px-4 rounded-lg border text-sm font-semibold transition-all",
              selectedVariantNew?.id === variant.id
                ? "bg-black text-white border-black"
                : "bg-white text-gray-800 border-gray-300 hover:border-black"
            )}
          >
            Variant {i + 1}
          </button>
        ))}

        <button
          onClick={() => setSelectedVariantNew(null)}
          className={clsx(
            "py-2 px-4 rounded-lg border text-sm font-semibold transition-all",
            selectedVariantNew === null
              ? "bg-black text-white border-black"
              : "bg-white text-gray-800 border-gray-300 hover:border-black"
          )}
        >
          Default
        </button>
      </div>

      {selectedVariantNew && (
        <div className="rounded-lg border p-4 bg-gray-50">
          <p className="text-sm font-semibold mb-2">Selected Variant Info</p>
          <div className="text-xs text-gray-600 space-y-1">
            <p>SKU: {selectedVariantNew.sku || "N/A"}</p>
            <p>
              Stock:{" "}
              {selectedVariantNew.stock !== null
                ? selectedVariantNew.stock
                : "N/A"}
            </p>
            {Object.entries(selectedVariantNew)
              .filter(([key]) => !excludedKeys.includes(key))
              .map(([key, value]) => (
                <p key={key} className="capitalize">
                  {key}: {value || "-"}
                </p>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VariantsCorner;
