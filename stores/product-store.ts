import { Product } from "@/app/(handlers)/types/product";
import { create } from "zustand";
import { persist } from "zustand/middleware";



interface ProductStore {
  product: Product;
  updateProduct: (updates: Partial<Product>) => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      product: {
        id: 0,
        storeId: 0,
        name: "",
        category: "",
        image: [],
        description: "",
        stock: 0,
        price: 0,
        discountedPrice: 0,
        rating: 0,
        videos: []
      },
      updateProduct: (updates) =>
        set((state) => ({
          product: { ...state.product, ...updates }
        }))
    }),
    {
      name: "product-storage"
    }
  )
);
