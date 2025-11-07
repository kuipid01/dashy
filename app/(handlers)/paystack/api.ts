"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../base";
import { 
  PaystackInitializeRequest,
  PaystackInitializeResponse,
  PaystackVerifyResponse,
  PaystackStatusResponse
} from "@/constants/types";

// Direct API functions for use outside of React Query
export const paystackAPI = {
  // Initialize Paystack payment
  initializePayment: async (data: PaystackInitializeRequest): Promise<PaystackInitializeResponse> => {
    console.log("DATA BEEN SENT", data);
    const response = await api.post("/paystack/initialize", data);
    return response.data || response.data.data;
  },

  // Verify Paystack payment
  verifyPayment: async (reference: string): Promise<PaystackVerifyResponse> => {
    const response = await api.get(`/paystack/verify/${reference}`);
    return response.data.data || response.data;
  },

  // Get Paystack payment status
  getPaymentStatus: async (reference: string): Promise<PaystackStatusResponse> => {
    const response = await api.get(`/paystack/status/${reference}`);
    return response.data.data || response.data;
  },
  // Get Paystack payment status
  verifyAccountNumber: async (accountNumber: string, bankCode: string): Promise<any> => {
    const response = await api.post(`/paystack/verify-account-number`, {
      account_number: accountNumber,
      bank_code: bankCode,
    });
    return response.data.data || response.data;
  },
  listBanks: async (): Promise<any> => {
    const response = await api.get(`/paystack/banks`);
    return response.data.data || response.data;
  },
};
