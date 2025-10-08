import { Order } from "@/constants/types";
import { api } from "../base";

export const trackingApi = {
  getPurchaseOrder: async (id: string): Promise<Order[] | null> => {
    const res = await api.get(`/purchase-orders/${id}`);
    return res.data.data || res.data || null;
  },

  loginPurchaseOrder: async (email: string, purchaseId: string) => {
    const res = await api.post("/publish-dash/auth", {
      email,
      purchase_id: purchaseId,
    });
    return res.data.data || res.data || null;
  },
  VerifyPurchaseOrder: async (email: string, purchaseId: string, otp: string) => {
    const res = await api.post("/publish-dash/verify", {
      email,
      purchase_id: purchaseId,
      otp: otp
    });
    return res.data.data || res.data || null;
  },




  UpdateOrderEscrow: async (id: number, data: ExpectedUpdateEscrowDT) => {
    const res = await api.put(`/orders/${id}/escrow`, data);
    return res.data.data || res.data || null;
  },
};




export interface ExpectedUpdateEscrowDT {
  delivery_approved_at?: Date | null,
  delivery_rejected_at?: Date | null,
  delivery_rejected_reason?: string | null,
  has_dispute?: boolean | null,
  refund_requested?: boolean | null,
  auto_disbursed?: boolean | null,
  auto_disbursed_at?: Date | null,
  released_at?: Date | null,
  refund_at?: Date | null,
  attachments?: string | null,
  store_dispute_proof?: string | null,
  store_dispute_response?: string | null,
  store_dispute_at?: Date | null,
  payment_status?: "held_in_escrow" | "paid" | "pending_disbursement" | "failed" | null,
}