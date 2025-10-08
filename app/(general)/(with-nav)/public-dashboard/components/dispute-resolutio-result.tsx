import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import {
  useGetBankListCOR,
  useInitiateTransfer,
  useValidateName
} from "@/app/(handlers)/cashonrails/query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export const DisputeResolutionResult = ({
  disputeResolved,
  storeGuilty,
  reason,
  refundAmount,
  refundType,
  orderId,
  refundStatus
}: {
  disputeResolved: boolean;
  storeGuilty: boolean;
  reason: string;
  refundAmount?: number;
  refundType?: "full" | "partial" | null;
  orderId: string;
  refundStatus?: "pending" | "success" | "failed";
}) => {
  const [bankDetails, setBankDetails] = useState({
    bankCode: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    refundAmount: 0,
    refundType: "full"
  });
  type ValidateNameResponse = {
    success: boolean;
    status: string;
    message: string;
    data: string;
  };

  const { data: validateName } = useValidateName(
    bankDetails.accountNumber,
    bankDetails.bankCode,
    "NGN"
  ) as { data?: ValidateNameResponse };

  const {
    data: bankList = {
      data: []
    } as {
      data: {
        code: string;
        name: string;
      }[];
    }
  } = useGetBankListCOR();

  const { mutate: initiateTransfer, isPending: isInitiatingTransfer } =
    useInitiateTransfer();
  const [showRefundForm, setShowRefundForm] = useState(false);
  console.log(refundStatus, "refundStatus");

  if (!disputeResolved) return null;
  if (refundStatus === "pending") {
    return (
      <div className="space-y-3">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800">Refund Initiated</h3>
          <p className="text-sm text-gray-700 mb-2">
            You will be notified when the refund is successful.
          </p>
        </div>
      </div>
    );
  }
  if (refundStatus === "success") {
    return (
      <div className="space-y-3">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800">Refund Successful</h3>

          <p>Check your bank account for the refund.</p>
        </div>
      </div>
    );
  }
  return (
    <Dialog open={showRefundForm} onOpenChange={setShowRefundForm}>
      <div className="space-y-3">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-green-800">Dispute Resolved</h3>
          </div>
          {/* Decision */}
          <p className="text-sm font-medium text-green-700 mb-2">
            {storeGuilty
              ? "Your claim has been reviewed and accepted."
              : "After review, the store’s response has been upheld."}
          </p>
          {/* Reason */}
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-medium">What this means: </span>
            {reason}
          </p>
          {/* Refund details (only if applicable) */}
          {storeGuilty && refundType && (
            <p className="text-sm  rounded-md px-2 py-1 text-gray-800 mb-2">
              {refundType === "full"
                ? `A full refund of ₦${refundAmount?.toLocaleString()} will be issued to your account.`
                : `A partial refund of ₦${refundAmount?.toLocaleString()} will be issued to your account.`}
            </p>
          )}
          {storeGuilty && (
            <>
              <p className="text-xs border-general-primary border italic w-fit text-general rounded-md px-2 py-1 mb-2">
                Dashbuy takes the commision regadless of the dispute resolution.
              </p>
              <Button
                disabled={isInitiatingTransfer}
                onClick={() => setShowRefundForm(true)}
                variant="outline"
                className="w-fit bg-green-500 text-white hover:bg-green-600"
              >
                {isInitiatingTransfer
                  ? "Initiating Refund..."
                  : "Initiate Refund"}
              </Button>
            </>
          )}
          {/* Customer Reassurance */}
          <p className="text-xs text-gray-500 italic">
            {storeGuilty
              ? "We’re sorry for the inconvenience. Our team works hard to ensure all sellers provide items in good condition."
              : "We appreciate your patience. Our goal is always to ensure fairness for both buyers and sellers."}
          </p>
        </div>
        {showRefundForm && (
          <Dialog open={showRefundForm} onOpenChange={setShowRefundForm}>
            <DialogContent className="bg-white  rounded-lg p-4">
              <DialogTitle className="text-lg font-semibold mb-4">
                Initiate Refund
              </DialogTitle>
              <DialogHeader>
                <DialogDescription>
                  Please fill in the details below to initiate the refund.
                </DialogDescription>
              </DialogHeader>
              <DialogDescription className="space-y-4">
                <Input
                  maxLength={10}
                  placeholder="Enter your bank account number"
                  value={bankDetails.accountNumber}
                  onChange={(e) =>
                    setBankDetails({
                      ...bankDetails,
                      accountNumber: e.target.value
                    })
                  }
                />
                <Select
                  value={bankDetails.bankCode}
                  onValueChange={(value) =>
                    setBankDetails({ ...bankDetails, bankCode: value })
                  }
                >
                  <SelectTrigger className="mt-1 border-gray-200 cursor-pointer h-[50px] border w-full rounded-md">
                    <SelectValue placeholder="Select bank" />
                    {bankDetails.bankCode}
                  </SelectTrigger>
                  <SelectContent>
                    {bankList?.data.map(
                      (bank: { code: string; name: string }) => (
                        <SelectItem key={bank.code} value={bank.code}>
                          {bank.name}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <Input
                  disabled
                  placeholder="Account name"
                  value={validateName?.data}
                />
              </DialogDescription>
              <DialogFooter>
                <Button
                  disabled={!validateName?.data || isInitiatingTransfer}
                  variant="outline"
                  className="w-full bg-green-500 text-white hover:bg-green-600"
                  onClick={() => {
                    if (!validateName?.data) return;

                    setBankDetails({
                      ...bankDetails,
                      refundAmount: refundAmount || 0,
                      refundType: refundType || "full"
                    });
                    initiateTransfer({
                      account_number: bankDetails.accountNumber,
                      account_name: validateName?.data,
                      bank_code: bankDetails.bankCode,
                      amount: refundAmount?.toString() || "0",
                      currency: "NGN",
                      sender_name: "Dashbuy",
                      narration: "Refund",
                      reference: "REFUND",
                      order_id: orderId
                    });
                    if (!isInitiatingTransfer) {
                      setShowRefundForm(false);
                    }
                  }}
                >
                  {isInitiatingTransfer
                    ? "Initiating Refund..."
                    : "Initiate Refund"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Dialog>
  );
};
