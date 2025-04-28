// types/product.ts
export interface Product {
    id: number;
    name: string;
    category: string;
    image: string; // Comma-separated string from backend
    videos?: string | null;
    description?: string | null;
    stock?: number | null;
    price: number;
    discountedPrice?: number | null;
    rating: number;
    storeId: number;
    store?: {
      id: number;
      name: string;
      // Add other store fields as needed
    };
    tweets?: { id: number; content: string }[]; // Simplified Tweet type
  }