import { Security } from "@/types/security";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Product = {
  name: string;
  rating: number;
  image: string;
  price: number;
};

// Placeholder types for related models (assuming common fields)
// You should replace these with your actual definitions if available.

export interface User {
  id: number;
  name: string

}

export interface Payment {
  id: string; // Assuming string ID based on PaymentID in Order
  amount: number;
  status: string; // e.g., 'completed', 'failed', 'pending'
  // ... other payment fields
}

export interface OrderItem {
  orderID?: number; // Foreign key, optional for creation
  productID: number;
  quantity: number;
  price: number;
  name: string;
  // ... other order item fields
}

export interface DeliveryOption {
  id: string; // Assuming string ID based on DeliveryID in Order
  name: string;
  description?: string;
  price: number;
  // ... other delivery option fields
}

export interface DeliveryAgent {
  id: number;
  name: string;
  // ... other delivery agent fields
}

export interface Contact {
  id: string; // Assuming string ID based on ContactID in Order
  name: string;
  phone: string;
  email?: string;
  // ... other contact fields
}

export interface Address {
  id: string; // Assuming string ID based on AddressID in Order
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  // ... other address fields
}

// Main Order Type
export interface Order {
  id: number;
  total: number;
  status:
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | string; // Gorm default 'pending'

  userId: number;
  user: User;

  storeId?: number; // Nullable in Go, so optional in TS
  store?: Store;

  paymentId?: string;
  payment?: Payment;

  orderItems: OrderItem[];

  // --- Delivery Information ---
  deliveryMode: "store" | "agent" | "external" | string;
  deliveryId?: string;
  deliveryOption?: DeliveryOption;

  agentId?: number;
  agent?: DeliveryAgent;

  thirdPartyProvider?: string;
  thirdPartyTrackingId?: string;

  // --- Address and Contact ---
  contactId?: string;
  contact?: Contact;

  addressId?: string;
  address?: Address;
  orderStatus: string;
  sales_means: "ONLINE" | "STORE"

  placedAt: string; // time.Time in Go maps to string (ISO 8601) in JSON/TS
  placed_at: string; // time.Time in Go maps to string (ISO 8601) in JSON/TS
  updatedAt: string; // time.Time in Go maps to string (ISO 8601) in JSON/TS
  deletedAt?: string; // gorm.DeletedAt is a pointer, so optional. Maps to string for timestamp or null.
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
  AvatarURL: string | null;
  avatar: string | null;
  avatar_url: string | null;
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

  security?: Security;
  hasCompletedOnboarding: boolean;

}

// Assuming you have a corresponding Go struct for Store
interface Store {
  // Define the properties of the Store struct here
  [key: string]: any; // Placeholder if you don't have the Store definition
}

export interface EarningsResponse {
  store_id: number;
  this_month_earnings: number;
  last_month_earnings: number;
  growth_rate: number;
  monthly_earnings: MonthlyEarning[];
}

interface MonthlyEarning {
  month: string; // e.g. "Jul 2025"
  amount: number; // earnings for that month
  start: string; // ISO timestamp (RFC3339)
  end: string; // ISO timestamp (RFC3339)
}



export interface ProductVariant {
  ID: string;
  ProductID: number;

  Size?: string;
  Color?: string;
  Material?: string;
  Weight?: number;
  Dimensions?: string;
  SKU?: string;
  Barcode?: string;
  Stock?: number;
  Price?: number;

  CreatedAt?: string; // ISO date string format
  UpdatedAt?: string;

  [key: string]: any; // Allow extra properties for flexibility
}



