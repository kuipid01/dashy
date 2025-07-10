import { Product } from "@/app/(handlers)/types/product";
import { Order, User } from "@/constants/types";

export interface Store {
  id: number;
  name: string;
  description?: string;
  store_logo?: string;
  cover_image?: string;

  phone_number?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;

  brand_color?: string;
  website_url?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;

  is_active: boolean;

  user_id: number;
  user?: User;

  products?: Product[];
  orders?: Order[];
  payments?: Record<string,string>[];
  delivery_options?: Record<string,string>[];

  created_at: string; // ISO string from `time.Time`
  updated_at: string;
}
