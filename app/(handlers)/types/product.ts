// types/product.ts
export interface Product {
    id: number;
    name: string;
    category: string;
    image: string[] | File[] ; // Comma-separated string from backend
    videos?: string[]  | File[] | null;
    description?: string | null;
    stock?: number | null;
    price: number;
    discountedPrice?: number | null;
    discounted_price?: number | null;
    rating: number;
    storeId: number;
    store_id: number;
    live:boolean;
    store?: {
      id: number;
      name: string;
      // Add other store fields as needed
    };
    tweets?: { id: number; content: string }[]; // Simplified Tweet type
  }
export interface ProductCreationShortDTO {
   
    name: string;
    category: string;
   
    image: string[] | File[] ; // Comma-separated string from backend
    
    description?: string | null;

    price: number;
    storeId: number;
    
  }