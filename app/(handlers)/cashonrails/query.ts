/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBankList, initiateTransfer, validateName } from "./api";
import { toast } from "sonner";







export const useGetBankListCOR = (enabled: boolean = true) => {
    return useQuery({
        queryKey: ["bank-list-cor"],
        queryFn: getBankList,
        enabled,
        staleTime: 10 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};



export const useValidateName = (account_number: string, bank_code: string, currency: string) => {
    return useQuery({
        queryKey: ["validate-name", account_number, bank_code, currency],
        queryFn: () => validateName(account_number, bank_code, currency),
        enabled: !!(account_number && bank_code && currency),
        staleTime: 10 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};


export const useInitiateTransfer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { account_number: string, account_name: string, bank_code: string, amount: string, currency: string, sender_name: string, narration: string, reference: string, order_id: string }) => initiateTransfer(data.account_number, data.account_name, data.bank_code, data.amount, data.currency, data.sender_name, data.narration, data.reference, data.order_id),
        onSuccess: () => {
            toast.success("Transfer initiated successfully, you will be notified when the transfer is successful");
            queryClient.invalidateQueries({ queryKey: ["order-list"] });
        },
        onError: (error: any) => {
            console.log(error, "error");
            toast.error("Failed to initiate transfer", {
                description: error.response?.data ?? "Failed to initiate transfer",
            });
        },
    });
};