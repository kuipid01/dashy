"use client";
import { api } from "../base";
import {
  ShippingConfig,
  ShippingZone,
  UpsertShippingConfigRequest,
  CreateShippingZoneRequest,
  UpdateShippingZoneRequest,
  ShippingQuoteResponse
} from "@/constants/types";

export const shippingAPI = {
  // protected: config
  upsertConfig: async (data: UpsertShippingConfigRequest): Promise<ShippingConfig> => {
    const res = await api.post("/shipping/config", data);
    return res.data.data || res.data;
  },
  getMyConfig: async (): Promise<ShippingConfig | null> => {
    const res = await api.get("/shipping/config");
    return res.data.data || res.data || null;
  },

  // protected: zones
  createZone: async (data: CreateShippingZoneRequest): Promise<ShippingZone> => {
    const res = await api.post("/shipping/zones", data);
    return res.data.data || res.data;
  },
  updateZone: async (id: string, data: UpdateShippingZoneRequest): Promise<ShippingZone> => {
    const res = await api.put(`/shipping/zones/${id}`, data);
    return res.data.data || res.data;
  },
  deleteZone: async (id: string): Promise<void> => {
    await api.delete(`/shipping/zones/${id}`);
  },
  getMyZones: async (): Promise<ShippingZone[]> => {
    const res = await api.get("/shipping/zones");


    return res.data.data || res.data.zones || res.data || [];
  },

  // public quotes
  quoteByDistance: async (params: { base_fee?: number; per_km?: number; distance_km: number }): Promise<ShippingQuoteResponse> => {
    const res = await api.get("/shipping/quote/distance", { params });
    return res.data.data || res.data;
  },
  quoteByZone: async (params: { zone_id: string; order_amount?: number }): Promise<ShippingQuoteResponse> => {
    const res = await api.get("/shipping/quote/zone", { params });
    return res.data.data || res.data;
  },

  getStoreConfig: async (storeId:number): Promise<ShippingConfig | null> => {
    const res = await api.get(`/shipping/config/public/${storeId}`);
    return res.data.data || res.data || null;
  },
};


