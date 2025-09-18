import React, { useState } from "react";
import Filters from "./flters";
import SearchBar, { FiltersState } from "./search-bar";

const SearchAndFilters = ({
  setFilters,
  filters
}: {
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
  filters: FiltersState;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
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
        <Filters filters={filters} setFilters={setFilters} />
      </div>
    </div>
  );
};

export default SearchAndFilters;
