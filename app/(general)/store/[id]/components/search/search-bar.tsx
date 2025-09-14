/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  setFilters: React.Dispatch<
    React.SetStateAction<{
      searchTerm: string;
      ratings: null;
      priceRange: null;
      category: string;
    }>
  >;
  filters: {
    searchTerm: string;
    ratings: null;
    priceRange: null;
    category: string;
  };
}

const SearchBar: React.FC<SearchBarProps> = ({
  query,
  setQuery,
  setFilters,
  filters
}) => {
  const [queryForDebounce, setQueryForDebounce] = useState("");
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setFilters({
        ...filters,
        searchTerm: queryForDebounce
      });
    }, 500);

    return () => {
      clearTimeout(timeOut);
    };
  }, [queryForDebounce]);

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        placeholder="Search products..."
        value={queryForDebounce}
        onChange={(e) => setQueryForDebounce(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
