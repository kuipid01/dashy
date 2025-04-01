import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Product {
  name: string;
  category: string;
  image: string[];
  description: string;
  stock: number;
  price: number;
}

interface ProductStore {
  product: Product;
  updateProduct: (updates: Partial<Product>) => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      product: {
        name: "",
        category: "",
        image: [],
        description: "",
        stock: 0,
        price: 0,
      },
      updateProduct: (updates) =>
        set((state) => ({
          product: { ...state.product, ...updates },
        })),
    }),
    {
      name: "product-storage",
    }
  )
);
