"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { shippingAPI } from "./api";
import {
  CreateShippingZoneRequest,
  ShippingConfig,
  ShippingZone,
  UpdateShippingZoneRequest
} from "@/constants/types";

// Query Keys
export const shippingKeys = {
  all: ["shipping"] as const,
  config: () => [...shippingKeys.all, "config"] as const,
  zones: () => [...shippingKeys.all, "zones"] as const,
  zoneById: (id: string) => [...shippingKeys.zones(), id] as const,
};

// Queries
export const useGetMyShippingConfig = () => {
  return useQuery<ShippingConfig | null>({
    queryKey: shippingKeys.config(),
    queryFn: () => shippingAPI.getMyConfig(),
  });
};

export const useGetMyShippingZones = () => {
  return useQuery<ShippingZone[]>({
    queryKey: shippingKeys.zones(),
    queryFn: () => shippingAPI.getMyZones(),
  });
};

// Mutations
export const useUpsertShippingConfig = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ShippingConfig & { base_fee?: number; per_km?: number }) =>
      shippingAPI.upsertConfig(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: shippingKeys.config() });
    },
  });
};
export const useUpsertShippingConfigWithJustLatLon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      lat: number,
      lng: number
    }) =>
      shippingAPI.upsertConfigLatLon(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: shippingKeys.config() });
    },
  });
};

export const useCreateShippingZone = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateShippingZoneRequest) => shippingAPI.createZone(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: shippingKeys.zones() });
    },
  });
};

export const useUpdateShippingZone = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateShippingZoneRequest }) =>
      shippingAPI.updateZone(id, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: shippingKeys.zoneById(variables.id) });
      qc.invalidateQueries({ queryKey: shippingKeys.zones() });
    },
  });
};

export const useDeleteShippingZone = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => shippingAPI.deleteZone(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: shippingKeys.zones() });
    },
  });
};


