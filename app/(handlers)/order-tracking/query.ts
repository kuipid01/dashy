import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { trackingApi, ExpectedUpdateEscrowDT } from "./purchase-order";
import { Order } from "@/constants/types";
import { orderKeys } from "../orders/queries";
  
export const orderTrackingKeys = {
  allorders: ["order-tracking"] as const,
  order: (id: string) => [...orderTrackingKeys.allorders, id] as const,
};

export const useGetAllPurchaseOrders = (id: string) => {
  return useQuery<Order[] | null>({
    queryKey: orderTrackingKeys.order(id),
    queryFn: () => trackingApi.getPurchaseOrder(id),
  });
};



export const useLoginPurchaseOrder = () => {
    return useMutation({
        mutationFn: (data: { email: string, purchaseId: string }) =>
            trackingApi.loginPurchaseOrder(data.email, data.purchaseId),
    }); 
};
export const useVerifyPurchaseOrder = () => {
    return useMutation({
        mutationFn: (data: { email: string, purchaseId: string , otp:string }) =>
            trackingApi.VerifyPurchaseOrder(data.email, data.purchaseId, data.otp),
    }); 
};


export const useUpdateOrderEscrow = (orderId: number, storeid?: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ExpectedUpdateEscrowDT) =>
            trackingApi.UpdateOrderEscrow(orderId, data),
        onSuccess: () => {
          console.log(storeid, "storeid");
            queryClient.invalidateQueries({ queryKey: orderTrackingKeys.order(orderId.toString()) });
            queryClient.invalidateQueries({ queryKey: orderTrackingKeys.allorders });
            queryClient.invalidateQueries({ queryKey: orderKeys.byId(orderId) });
            if (storeid) {
                console.log(storeid, "storeid");
                queryClient.invalidateQueries({ queryKey: orderKeys.byStoreId(storeid) });
            }
        },
    });
};