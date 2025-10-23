"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LandingScreen from "./components/landing-screen";
import DiscoverFeed from "./components/discover-feed";
import SearchInterface from "./components/search-interface";
import ProductDetailModal from "./components/product-detail-modal";
import { useCartStore } from "@/stores/cart-store";
import { Product } from "@/app/(handlers)/types/product";

type ViewState = "landing" | "feed" | "search" | "product-detail";

export default function ProductDiscovery() {
  const [currentView, setCurrentView] = useState<ViewState>("landing");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addItem } = useCartStore();

  const handleDiscover = () => {
    setCurrentView("feed");
  };

  const handleSearch = () => {
    setCurrentView("search");
  };

  const handleBackToFeed = () => {
    setCurrentView("feed");
  };

  const handleBackToLanding = () => {
    setCurrentView("landing");
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView("product-detail");
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setCurrentView("feed");
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    addItem(product, quantity);
  };

  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence mode="wait">
        {currentView === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <LandingScreen
              onDiscover={handleDiscover}
              onSearch={handleSearch}
            />
          </motion.div>
        )}

        {currentView === "feed" && (
          <motion.div
            key="feed"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <DiscoverFeed
              onSearch={handleSearch}
              onProductSelect={handleProductSelect}
            />
          </motion.div>
        )}

        {currentView === "search" && (
          <motion.div
            key="search"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
          >
            <SearchInterface
              isOpen={true}
              onClose={handleBackToLanding}
              onBackToFeed={handleBackToFeed}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={currentView === "product-detail"}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}
