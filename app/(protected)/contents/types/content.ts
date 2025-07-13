import { Product } from "@/app/(handlers)/types/product";
import { Store } from "@/types/store";

export interface ContentItem {
  id: string;
  title: string;
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  description: string;
  tags: string[];
  createdAt: Date;
  created_at?: string;
  updated_at?: string;
  updatedAt: Date;
  status: "draft" | "published" | "archived";
  analytics: {
    views: number;
    clicks: number;
    clickThroughRate: number;
    engagement: number;
  };

  product?: Partial<Product>;
  store?: Partial<Store>;
}
export interface ContentItemPayload {
  id: string;
  title: string;
  type: "photo" | "video";
  url: string;
  thumbnail?: string;
  description: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  status: "draft" | "published" | "archived";
  analytics: {
    views: number;
    clicks: number;
    clickThroughRate: number;
    engagement: number;
  };
}

export interface ContentStats {
  totalContent: number;
  totalViews: number;
  totalClicks: number;
  avgClickThroughRate: number;
  avgEngagement: number;
}
