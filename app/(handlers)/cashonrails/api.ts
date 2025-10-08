
import { api } from "../base";

export const getBankList = async () => {
    const response = await api.get("/payments/banks");
    return response.data;
};

export const validateName = async (account_number: string, bank_code: string, currency: string) => {
    const response = await api.post("/payments/validate-name", {
        account_number,
        bank_code,
        currency,
    });
    return response.data;
};

export const initiateTransfer = async (
    account_number: string,
    account_name: string,
    bank_code: string,
    amount: string,
    currency: string,
    sender_name: string,
    narration: string,
    reference: string,
    order_id: string
) => {
    const response = await api.post("/payments/transfer", {
        account_number,
        account_name,
        bank_code,
        amount,
        currency,
        sender_name,
        narration,
        reference,
        order_id,
    });
    return response.data;
};
