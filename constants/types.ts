import { Security } from "@/types/security";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Product = {
  id: number;
  name: string;
  category: string;
  image: string[] | File[]; // Comma-separated string from backend
  videos?: string[] | File[] | null;
  description?: string | null;
  stock?: number | null;
  price: number;
  discountedPrice?: number | null;
  discounted_price?: number | null;
  rating: number;
  storeId: number;
  store_id: number;
  live: boolean;
  createdAt?: string; // ISO date string for when product was created
  store?: {
    id: number;
    name: string;
    // Add other store fields as needed
  };
  tweets?: { id: number; content: string }[]; // Simplified Tweet type

  Name: string;

  Image: string;

  Category: string;
  Stock: number | null;
  ID: number;
}

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
  Product: Product;
  UnitPrice: number;
  TotalPrice: number;
  CreatedAt: Date;
  Quantity: number
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
  id?: string; // Assuming string ID based on AddressID in Order
  Id?: string; // Assuming string ID based on AddressID in Order
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  Street?: string;
  City?: string;
  State?: string;
  ZipCode?: string;
  Country?: string;
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
  | "draft"
  | "dispute"
    | string; // Gorm default 'pending'

  userId: number;
  user: User;
  net_total: number;
  commision: number;
  storeId?: number; // Nullable in Go, so optional in TS
  store_id?: number; // Nullable in Go, so optional in TS
  store?: Store;

  paymentId?: string;
  payment?: Payment;

  orderItems: OrderItem[];
  order_items: OrderItem[];

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
  arrival_date: Date;
  placedAt: string; // time.Time in Go maps to string (ISO 8601) in JSON/TS
  placed_at: string; // time.Time in Go maps to string (ISO 8601) in JSON/TS
  updatedAt: string; // time.Time in Go maps to string (ISO 8601) in JSON/TS
  shipping_fee: number;
  payment_status: "held_in_escrow" | "paid" | "pending_disbursement" | "failed";
  deletedAt?: string; // gorm.DeletedAt is a pointer, so optional. Maps to string for timestamp or null.


  delivery_approved_at?: Date | null;
  delivery_rejected_at?: Date | null;
  delivery_rejected_reason?: string | null;
  has_dispute?: boolean | null;
  refund_requested?: boolean | null;
  auto_disbursed?: boolean | null;
  auto_disbursed_at?: Date | null;
  released_at?: Date | null;
  refund_at?: Date | null;
  refund_status?: "pending" | "success" | "failed";
  dispute_proof?: string | null;
  store_dispute_proof?: string | null;
  store_dispute_response?: string | null;
  store_dispute_at?: Date | null;
  dispute_winner?: "store" | "customer" | null; 
  dispute_resolved_reason?: string | null;
  platform_to_store_payment_status?: string | null | "completed" | "pending";
	platform_to_store_payment_at?: Date | null;
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

// Temporal User Types
export interface TemporalUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  status: "active" | "pending" | "inactive";
  createdAt: string;
  updatedAt: string;
  orders?: Order[];
}

export interface CreateTemporalUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface UpdateTemporalUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  status?: "active" | "pending" | "inactive";
}

export interface LinkOrderToTemporalUserRequest {
  temporalUserId: number;
  orderId: number;
}

export interface TemporalUserWithOrders extends TemporalUser {
  orders: Order[];
}

// Order API Request/Response Types
export interface CreateOrderRequest {
  purhase_id:string,
  userId?: number;
  temporalUserId?: number;
  store_id: number;
  order_items: {
    product_id: number;
    quantity: number;
    price: number;
  }[];
  deliveryMode: "store" | "agent" | "external";
  deliveryId?: string;
  agentId?: number;
  thirdPartyProvider?: string;
  contact?: {
    id: string
  };
  paymentstatus: boolean,
  address?: {
    id: string
  };
  sales_means: "ONLINE" | "STORE";
  notes?: string;
  shipping: {
    zone_id?: string,
    zone_name?: string,
    fee: number,
    distance?: number
  }
}
export interface CreateTemporalOrderRequest {
  purhase_id:string,
  store_id: number;
  order_items: {
    product_id: number;
    quantity: number;
    price: number;
  }[];
  deliveryMode: "store" | "agent" | "external";
  deliveryId?: string;
  agentId?: number;
  thirdPartyProvider?: string;
  contact?: {
    id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    sub_contact_phone?: string;
    sub_contact_email?: string;
  };
  paymentstatus: boolean,
  address?: {
    id?: string;
    street?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
    description?: string;
  };
  sales_means: "ONLINE" | "STORE";
  notes?: string;
  temporal_user: {
    email: string,
    first_name: string,
    last_name: string,
    phone: string
  },
  shipping: {
    zone_id?: string,
    zone_name?: string,
    fee: number,
    distance?: number
  }

}

export interface UpdateOrderRequest {
  status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  deliveryMode?: "store" | "agent" | "external";
  deliveryId?: string;
  agentId?: number;
  thirdPartyProvider?: string;
  thirdPartyTrackingId?: string;
  contactId?: string;
  addressId?: string;
  notes?: string;
  arrival_date?: Date
}

export interface LinkOrderToDeliveryOptionRequest {
  deliveryId: string;
  deliveryMode: "store" | "agent" | "external";
  agentId?: number;
  thirdPartyProvider?: string;
  thirdPartyTrackingId?: string;
}

export interface OrderWithProducts extends Order {
  orderItems: (OrderItem & {
    Product: Product;
  })[];
}

export interface OrderWithStore extends Order {
  store: Store;
}

export interface OrderResponse {
  success: boolean;
  data: Order;
  message?: string;
}

export interface OrdersListResponse {
  success: boolean;
  data: {
    orders: Order[];
    total: number;
    page: number;
    limit: number;
  };
  message?: string;
}

// Contact Types
export interface Contact {
  ID: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  SubContactPhone: string;
  SubContactEmail: string;
  UserID: number;
  CreatedAt?: string;
  UpdatedAt?: string;
  DeletedAt?: string | null;
}

// Contact API Request/Response Types
export interface CreateContactRequest {
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  SubContactPhone?: string;
  SubContactEmail?: string;
}

export interface UpdateContactRequest {
  FirstName?: string;
  LastName?: string;
  Email?: string;
  Phone?: string;
  SubContactPhone?: string;
  SubContactEmail?: string;
}

export interface CreatePublicContactRequest extends CreateContactRequest {
  user_email: string;
}

export interface UpdatePublicContactRequest extends UpdateContactRequest {
  user_email: string;
}

export interface ContactResponse {
  success: boolean;
  data: Contact;
  message?: string;
}

export interface ContactsListResponse {
  success: boolean;
  data: {
    contacts: Contact[];
    total: number;
    page: number;
    limit: number;
  };
  message?: string;
}

export interface ContactSearchResponse {
  success: boolean;
  data: {
    contacts: Contact[];
    query: string;
    total: number;
  };
  message?: string;
}




// ===================== Shipping & Delivery Types =====================
export type ShippingPricingModel = "zones" | "distance";

export interface ShippingConfig {
  model: ShippingPricingModel;
  base_fee?: number; // distance model
  per_km?: number;
  store: Store;  // distance model
  storeLocation?: {
    lat: number
    lng: number
    address?: string
  };
  zones?: ShippingZone[]
}

export interface ShippingZone {
  id: string;
  name: string;
  coverage_type: "radius" | "manual";
  coverage_value: string; // e.g. "Within 10km radius" or "Lagos: Ikeja, Yaba"
  flat_fee: number;
  free_ship_min?: number | null;
  estimatedDays?: number
}

export interface UpsertShippingConfigRequest {
  model: ShippingPricingModel;
  base_fee?: number;
  per_km?: number;
}

export interface CreateShippingZoneRequest {
  name: string;
  coverage_type: "radius" | "manual";
  coverage_value: string;
  flat_fee: number;
  free_ship_min?: number | null;
  estimatedDays?: number;
}

export type UpdateShippingZoneRequest = Partial<CreateShippingZoneRequest>;

export interface DistanceQuoteQuery {
  base_fee?: number;
  per_km?: number;
  distance_km: number;
}

export interface ZoneQuoteQuery {
  zone_id: string;
  order_amount?: number;
}

export interface ShippingQuoteResponse {
  amount: number;
  currency: string; // e.g., NGN
  breakdown?: Record<string, number>;
}



export interface Location {
  place_id: string;
  licence: string;
  boundingbox: [string, string, string, string];
  lat: string;
  lon: string;
  display_name: string;
  importance: number;
  address: {
    road?: string;
    city?: string;
    state?: string;
    county?: string;
    country: string;
    country_code: string;
  };
}

// ===================== Feedback Types =====================
export interface Feedback {
  id: number;
  stars: number; // 1-5 rating
  feedback: string;
  user_id?: number;
  user?: User;
  order_id?: number;
  order?: Order;
  product_id?: number;
  product?: Product;
  store_id?: number;
  store?: Store;
  created_at: string;
  updated_at: string;
}

export interface CreateFeedbackRequest {
  stars: number; // 1-5 rating
  feedback: string;
  order_id?: number;
  product_id?: number;
  store_id?: number;
}

export interface UpdateFeedbackRequest {
  stars?: number;
  feedback?: string;
}

export interface FeedbackResponse {
  success: boolean;
  data: Feedback;
  message?: string;
}

export interface FeedbacksListResponse {
  success: boolean;
  data: {
    feedbacks: Feedback[];
    total: number;
    page: number;
    limit: number;
  };
  message?: string;
}

export interface AverageRatingResponse {
  success: boolean;
  data: {
    average_rating: number;
    total_feedbacks: number;
    rating_breakdown: {
      "1": number;
      "2": number;
      "3": number;
      "4": number;
      "5": number;
    };
  };
  message?: string;
}

export interface FeedbacksByStarsResponse {
  success: boolean;
  data: {
    feedbacks: Feedback[];
    star_rating: number;
    total: number;
    page: number;
    limit: number;
  };
  message?: string;
}
