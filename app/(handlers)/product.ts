
import { api } from "./base";
import { Product } from "./types/product";

export async function fetchStoreProducts(storeId: string): Promise<Product[]> {
    const response = await api.get(`/stores/${storeId}/products`);
    return response.data;
  }