import React, { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useFetchCategories } from "@/app/(handlers)/product/product";

type FiltersState = {
  searchTerm: string;
  ratings: number | null;
  priceRange: [number, number] | null;
  category: string;
};

const MIN_PRICE = 0;
const MAX_PRICE = 1000000;

const Filters = ({
  filters,
  setFilters
}: {
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
}) => {
  const { categories, isLoading } = useFetchCategories();

  // Local UI state with debouncing to limit backend calls
  const [localRating, setLocalRating] = useState<number>(filters.ratings ?? 0);
  const [localPrice, setLocalPrice] = useState<[number, number]>(
    filters.priceRange ?? [MIN_PRICE, MAX_PRICE]
  );
  const categoryOptions = useMemo(() => {
    const base = [{ value: "", label: "All Categories" }];
    return base.concat((categories ?? []).map((c) => ({ value: c, label: c })));
  }, [categories]);

  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        ratings: localRating > 0 ? localRating : null
      }));
    }, 300);
    return () => clearTimeout(t);
  }, [localRating, setFilters]);

  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        priceRange:
          localPrice[0] !== MIN_PRICE || localPrice[1] !== MAX_PRICE
            ? localPrice
            : null
      }));
    }, 500);
    return () => clearTimeout(t);
  }, [localPrice, setFilters]);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex items-center gap-2 text-gray-700">
        <SlidersHorizontal size={18} />
        <span className="font-medium">Filters</span>
      </div>

      <div className="flex flex-wrap gap-3 w-full">
        {/* Category */}
        <div className="relative min-w-[160px]">
          <select
            className="appearance-none w-full pl-3 pr-8 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            value={filters.category}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, category: e.target.value }))
            }
            disabled={isLoading}
          >
            {categoryOptions.map((o) => (
              <option key={o.value || "all"} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        {/* Ratings slider */}
        <div className="flex items-center gap-2 min-w-[220px]">
          <span className="text-sm text-gray-600">Rating:</span>
          <input
            type="range"
            min={0}
            max={5}
            step={1}
            value={localRating}
            onChange={(e) => setLocalRating(parseFloat(e.target.value))}
            className="w-40"
          />
          <span className="text-sm font-medium">{localRating.toFixed(1)}+</span>
        </div>

        {/* Price range */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Price:</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="w-20 px-2 py-1 border border-gray-300 rounded"
              value={localPrice[0]}
              min={MIN_PRICE}
              max={localPrice[1]}
              onChange={(e) =>
                setLocalPrice(([, hi]) => [
                  Math.min(Math.max(MIN_PRICE, Number(e.target.value)), hi),
                  hi
                ])
              }
            />
            <span className="text-sm">-</span>
            <input
              type="number"
              className="w-20 px-2 py-1 border border-gray-300 rounded"
              value={localPrice[1]}
              min={localPrice[0]}
              max={MAX_PRICE}
              onChange={(e) =>
                setLocalPrice(([lo]) => [
                  lo,
                  Math.max(Math.min(MAX_PRICE, Number(e.target.value)), lo)
                ])
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
