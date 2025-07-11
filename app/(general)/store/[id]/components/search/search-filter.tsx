/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import Filters from "./flters";
import { filters } from "../data/filter";
import SearchBar from "./search-bar";

const SearchAndFilters = ({setFilters}:{setFilters:React.Dispatch<React.SetStateAction<{
    searchTerm: string;
    ratings: null;
    priceRange: null;
    category: string;
}>>}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string>
  >({
    category: "all",
    price: "all",
    rating: "all"
  });

  return (
    <div className="sticky top-0 z-10 bg-gray-50 pt-4 pb-4">
      <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
        <SearchBar query={searchQuery} setQuery={setSearchQuery} />
        <Filters
          filters={filters}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />
      </div>
    </div>
  );
};

export default SearchAndFilters;
