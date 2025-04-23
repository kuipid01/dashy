import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Product {
  id?: number | string;
  name: string;
  category: string;
  image: (string | File)[] | string;
  videos?: (string | File)[];
  description?: string;
  stock?: number;
  price: number;
  discountedPrice?: number;
  rating: number;
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
