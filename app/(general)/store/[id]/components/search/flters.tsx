import React from "react";
import { Filter as FilterType } from "../types/index";
import { SlidersHorizontal } from "lucide-react";

interface FiltersProps {
  filters: FilterType[];
  selectedFilters: Record<string, string>;
  setSelectedFilters: (filters: Record<string, string>) => void;
}

const Filters: React.FC<FiltersProps> = ({
  filters,
  selectedFilters,
  setSelectedFilters
}) => {
  const handleFilterChange = (filterId: string, value: string) => {
    setSelectedFilters({
      ...selectedFilters,
      [filterId]: value
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex items-center gap-2 text-gray-700">
        <SlidersHorizontal size={18} />
        <span className="font-medium">Filters:</span>
      </div>
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <div key={filter.id} className="relative min-w-[120px]">
            <select
              id={filter.id}
              className="appearance-none w-full pl-3 pr-8 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={selectedFilters[filter.id] || "all"}
              onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            >
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
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
        ))}
      </div>
    </div>
  );
};

export default Filters;
