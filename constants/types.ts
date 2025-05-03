/* eslint-disable @typescript-eslint/no-explicit-any */
export type Product = {
  name: string;
  rating: number;
  image: string;
  price: number;
  
};



export type Order = {
  orderId: string;
  arrivalDate: string;
  status: string;
  from: string;
  to: string;
  items: {
      name: string;
      price: number;
      image: string;
  }[];
}


export interface User {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;

  // Core Info
  Name: string | null;
  Email: string | null;

  // OAuth IDs (non-sensitive)
  GithubID: string | null;
  TwitterID: string | null;
  InstagramID: string | null;
  GoogleID: string | null;

  // Metadata
  avatar: string | null;
  Provider: string | null;
  LastLoginAt: string | null;
  IsVerified: boolean;
  IsStore: boolean;

  // Relations
  Store: Store | null;

  // App-level Metadata
  IsPaid: boolean | null;
  MonthlyPosts: number | null;
  APIKeyIndex: number | null;
  ClientIDStr: string | null;
}


// Assuming you have a corresponding Go struct for Store
interface Store {
  // Define the properties of the Store struct here
  [key: string]: any; // Placeholder if you don't have the Store definition
}