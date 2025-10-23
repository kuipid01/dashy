"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  Search, 
  Grid3X3, 
  Film, 
  Filter,
  X,
  SlidersHorizontal
} from "lucide-react";
import Image from "next/image";

interface SearchInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToFeed: () => void;
}

interface Product {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
}

// Mock data for demonstration
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    price: 15000,
    discountedPrice: 12000,
    image: "/placeholder.svg",
    category: "Electronics",
    rating: 4.8,
    reviews: 234
  },
  {
    id: "2", 
    name: "Smart Fitness Watch",
    price: 25000,
    discountedPrice: 20000,
    image: "/placeholder.svg",
    category: "Electronics",
    rating: 4.6,
    reviews: 189
  },
  {
    id: "3",
    name: "Organic Cotton T-Shirt",
    price: 5000,
    discountedPrice: 3500,
    image: "/placeholder.svg",
    category: "Fashion",
    rating: 4.7,
    reviews: 156
  },
  {
    id: "4",
    name: "Ceramic Coffee Mug Set",
    price: 8000,
    discountedPrice: 6000,
    image: "/placeholder.svg",
    category: "Home",
    rating: 4.9,
    reviews: 78
  }
];

const filterChips = [
  { label: "Price", value: "price" },
  { label: "Category", value: "category" },
  { label: "Trend", value: "trend" },
  { label: "Location", value: "location" }
];

const quickChips = [
  { label: "Gifts", value: "gifts" },
  { label: "Tech", value: "tech" },
  { label: "Fashion", value: "fashion" },
  { label: "Under ₦20,000", value: "under-20k" }
];

export default function SearchInterface({ isOpen, onClose, onBackToFeed }: SearchInterfaceProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "feed">("grid");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedQuickChips, setSelectedQuickChips] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFilterToggle = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const handleQuickChipToggle = (chip: string) => {
    setSelectedQuickChips(prev => 
      prev.includes(chip) 
        ? prev.filter(c => c !== chip)
        : [...prev, chip]
    );
  };

  const handleClearFilters = () => {
    setSelectedFilters([]);
    setSelectedQuickChips([]);
    setSearchTerm("");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-white z-50 overflow-hidden"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="search"
                placeholder="Search by name, brand, or purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className="text-gray-500 hover:text-gray-700"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
          </div>

          {/* Filter chips */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: showFilters ? "auto" : 0, 
              opacity: showFilters ? 1 : 0 
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 mb-3">
              {filterChips.map((filter) => (
                <Button
                  key={filter.value}
                  variant={selectedFilters.includes(filter.value) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterToggle(filter.value)}
                  className="text-xs"
                >
                  {filter.label}
                </Button>
              ))}
              {selectedFilters.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-xs text-gray-500"
                >
                  Clear all
                </Button>
              )}
            </div>
          </motion.div>

          {/* View mode toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="text-xs"
              >
                <Grid3X3 className="w-4 h-4 mr-1" />
                Grid
              </Button>
              <Button
                variant={viewMode === "feed" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("feed")}
                className="text-xs"
              >
                <Film className="w-4 h-4 mr-1" />
                Feed
              </Button>
            </div>
            <span className="text-sm text-gray-500">
              {filteredProducts.length} results
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto h-[calc(100vh-140px)]">
          {filteredProducts.length === 0 ? (
            /* Empty state */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nothing matches yet
              </h3>
              <p className="text-gray-600 mb-6">
                Tell us what you're looking for 👇
              </p>
              
              {/* Quick chips for empty state */}
              <div className="flex flex-wrap gap-2 justify-center">
                {quickChips.map((chip) => (
                  <Button
                    key={chip.value}
                    variant={selectedQuickChips.includes(chip.value) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleQuickChipToggle(chip.value)}
                    className="text-xs"
                  >
                    {chip.label}
                  </Button>
                ))}
              </div>
            </motion.div>
          ) : (
            /* Results */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={
                viewMode === "grid" 
                  ? "grid grid-cols-2 md:grid-cols-3 gap-4"
                  : "space-y-4"
              }
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    <div className="relative aspect-square">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-gray-900">
                          ₦{product.discountedPrice?.toLocaleString()}
                        </span>
                        {product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            ₦{product.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(product.rating)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            >
                              ★
                            </div>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          ({product.reviews})
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => onBackToFeed()}
                      >
                        View Product
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
