"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paystackAPI } from "./api";
import { toast } from "sonner";

// Query Keys
export const paystackKeys = {
    all: ["paystack"] as const,
    verify: (reference: string) => [...paystackKeys.all, "verify", reference] as const,
    status: (reference: string) => [...paystackKeys.all, "status", reference] as const,
};

// React Query Hooks

/**
 * Hook to initialize Paystack payment
 * This creates a payment session and returns authorization URL
 */
export const useInitializePaystackPayment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: paystackAPI.initializePayment,
        onSuccess: (data) => {
            toast.success("Payment initialized successfully");
            // Store the reference in cache for potential verification
            if (data.data?.reference) {
                queryClient.setQueryData(
                    paystackKeys.verify(data.data.reference),
                    { status: "pending", reference: data.data.reference }
                );
            }
        },
        onError: (error: unknown) => {
            console.error("Failed to initialize payment:", error);
            toast.error("Failed to initialize payment. Please try again.");
        },
    });
};

/**
 * Hook to verify Paystack payment
 * This checks if a payment was successful
 */
export const useVerifyPaystackPayment = (reference: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: paystackKeys.verify(reference),
        queryFn: () => paystackAPI.verifyPayment(reference),
        enabled: enabled && !!reference,
        staleTime: 30 * 1000, // 30 seconds - payment verification should be fresh
        retry: 3, // Retry verification attempts
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    });
};

/**
 * Hook to get Paystack payment status
 * This provides current status without full verification details
 */
export const useGetPaystackPaymentStatus = (reference: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: paystackKeys.status(reference),
        queryFn: () => paystackAPI.getPaymentStatus(reference),
        enabled: enabled && !!reference,
        staleTime: 10 * 1000, // 10 seconds - status should be very fresh
        refetchInterval: 5000, // Poll every 5 seconds for status updates
        refetchIntervalInBackground: false, // Stop polling when tab is not active
    });
};

/**
 * Hook to manually verify payment (useful for retry scenarios)
 */
export const useVerifyPaystackPaymentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: paystackAPI.verifyPayment,
        onSuccess: (data, reference) => {
            // Update cache with verification result
            queryClient.setQueryData(paystackKeys.verify(reference), data);
            queryClient.setQueryData(paystackKeys.status(reference), {
                success: true,
                data: {
                    reference: data.data.reference,
                    status: data.data.status,
                    amount: data.data.amount,
                    currency: data.data.currency,
                    created_at: data.data.created_at,
                    paid_at: data.data.paid_at,
                    customer: data.data.customer,
                    metadata: data.data.metadata,
                },
            });

            if (data.data.status === "success") {
                toast.success("Payment verified successfully!");
            } else {
                toast.error("Payment verification failed");
            }
        },
        onError: (error: unknown) => {
            console.error("Failed to verify payment:", error);
            toast.error("Failed to verify payment. Please try again.");
        },
    });
};

/**
 * Hook to manually check payment status (useful for retry scenarios)
 */
export const useGetPaystackPaymentStatusMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: paystackAPI.getPaymentStatus,
        onSuccess: (data, reference) => {
            // Update cache with status result
            queryClient.setQueryData(paystackKeys.status(reference), data);

            if (data.data.status === "success") {
                toast.success("Payment completed successfully!");
            } else if (data.data.status === "failed") {
                toast.error("Payment failed");
            }
        },
        onError: (error: unknown) => {
            console.error("Failed to get payment status:", error);
            toast.error("Failed to get payment status. Please try again.");
        },
    });
};


export const useVerifyAccountNumber = (accountNumber: string, bankCode: string) => {
    return useQuery({
        queryKey: ["verify-account-number", accountNumber, bankCode],
        queryFn: () => paystackAPI.verifyAccountNumber(accountNumber, bankCode),
        enabled: !!(accountNumber.length>9 && bankCode.length>1),
        staleTime: 10 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

export const useListBanks = () => {
  return useQuery({
    queryKey: ["paystack-banks"],
    queryFn: paystackAPI.listBanks,
  });
};