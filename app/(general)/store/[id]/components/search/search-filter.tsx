import React, { useState } from "react";
import Filters from "./flters";
import { filters as FakeFilters } from "../data/filter";
import SearchBar from "./search-bar";

const SearchAndFilters = ({
  setFilters,
  filters
}: {
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
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string>
  >({
    category: "all",
    price: "all",
    rating: "all"
  });

  console.log(selectedFilters);

  console.log(searchQuery);

  return (
    <div className="sticky top-0 z-10  pt-4 pb-4">
      <div className="bgblur rounded-xl shadow-sm p-4 space-y-4">
        <SearchBar
          filters={filters}
          setFilters={setFilters}
          query={searchQuery}
          setQuery={setSearchQuery}
        />
        <Filters
          filters={FakeFilters}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />
      </div>
    </div>
  );
};

export default SearchAndFilters;
