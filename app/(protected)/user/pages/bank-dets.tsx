"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  useListBanks,
  useVerifyAccountNumber,
} from "@/app/(handlers)/paystack/queries";
import { cn } from "@/lib/utils";
import {
  useAddBank,
  useCheckUserPassword,
  useDeleteBank,
  useGetBanks,
  useMakeBankSubaccount,
  useUpdateBank,
} from "@/app/(handlers)/user/user";
import { set } from "date-fns";
import ConfirmDelete from "@/app/(general)/_compoenents/confirm-delete";
import { ButtonLikePill } from "@/app/(general)/_compoenents/pill-round";
import {
  useFetchUser,
  useFetchUserStore,
} from "@/app/(handlers)/auth-handlers/auth";

export type BankAccount = {
  id: string;
  bank_name: string;
  account_number: string;
  account_name?: string;
  is_primary: boolean;
  is_substitute: boolean;
  verified: boolean;
};

export default function BankDetails() {
  const { user, isLoading } = useFetchUser();
  console.log(user);
  const { addBank, addingBank } = useAddBank();
  const { mutateAsync: makeSubAccount, isPending: subAccountLoading } =
    useMakeBankSubaccount();
  const { deleteBank, deletingBank } = useDeleteBank();
  const { updateBank, updatingBank } = useUpdateBank();
  const {
    isPending: checkingPassword,
    mutateAsync: checkPassword,
    data,
  } = useCheckUserPassword();

  const { store, isLoading: storeLoading } = useFetchUserStore();
  const userStore = store?.store;
  // console.log(userStore);

  const { data: myBanks, isFetching } = useGetBanks();
  const { data: bankList } = useListBanks();
  const [banks, setBanks] = useState<BankAccount[] | []>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteBankModal, setDeleteBankModal] = useState(false);
  const [showPasswordEntering, setShowPasswordEntering] = useState(false);
  const [idOfbankToBeDeleted, setIdbankToBeDeleted] = useState<null | string>(
    null
  );
  // Form state
  const [selectedBank, setSelectedBank] = useState<Record<any, any> | null>(
    null
  );
  const [accountNumber, setAccountNumber] = useState("");
  const [password, setPassword] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [isSubstitute, setIsSubstitute] = useState(false);

  const { data: verifyAccountNumber, isLoading: isVerifying } =
    useVerifyAccountNumber(accountNumber, selectedBank?.bankCode);
  // Mock: Load banks from API

  useEffect(() => {
    if (myBanks && myBanks.banks) {
      setBanks(myBanks.banks);
    }
  }, [myBanks]);

  console.log("banklist", myBanks);
  const openAddBankModal = () => {
    setSelectedBank(null);
    setAccountNumber("");
    setAccountName("");
    setIsPrimary(banks.length === 0); // First bank is primary by default
    setIsSubstitute(false);
    setModalOpen(true);
  };
  const makeSubAccountFn = async ({ bankId }: { bankId: string }) => {
    try {
      await makeSubAccount({
        bank_id: bankId.toString(),
        description: "",
      });
    } catch (error: any) {
      console.log(error);
      toast.error(
        error.response.data.error ?? "Failed to make this a sub account"
      );
    }
  };
  const addBankAccount = async () => {
    if (!selectedBank || !verifyAccountNumber?.account_name) {
      toast.error("Please complete all fields");
      return;
    }

    // Check if primary already exists
    if (isPrimary && banks.some((b) => b.is_primary)) {
      toast.error("A primary account already exists. Please unset it first.");
      setShowPasswordEntering(false);
      return;
    }
    const newBank: BankAccount = {
      id: Date.now().toString(),
      bank_name:
        bankList.find((b: { code: string }) => b.code === selectedBank.bankCode)
          ?.name || "",
      account_number: accountNumber,
      account_name: verifyAccountNumber?.account_name,
      is_primary: isPrimary,
      is_substitute: isSubstitute,
      verified: true,
    };
    try {
      // Replace with your actual API call
      // const response = await fetch('/api/bank-accounts', {
      //   method: 'POST',
      //   body: JSON.stringify({ bank_name: selectedBank, account_number: accountNumber, ... })
      // });
      console.log();

      setBanks((prev) => [...prev, newBank]);
      await addBank({
        account_number: accountNumber,
        bank_name: newBank.bank_name,
        is_primary: isPrimary,
        is_substitute: isSubstitute,
        verified: true,
        account_name: verifyAccountNumber?.account_name,
      });
      toast.success("Bank account added successfully");
      setModalOpen(false);
    } catch (error: any) {
      const prevBanks = banks.filter((b) => b.id !== newBank.id);
      setBanks(prevBanks);
      console.error("Failed to add bank", error);
      toast.error(error?.response?.data?.error ?? "Failed to add bank account");
    } finally {
      setShowPasswordEntering(false);
    }
  };

  const removeBank = async (id: string) => {
    const bank = banks.find((b) => b.id === id);
    if (bank?.is_primary) {
      toast.error(
        "Cannot remove primary account. Set another account as primary first."
      );
      return;
    }

    try {
      setIdbankToBeDeleted(id);
      //   setBanks((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {}
  };

  const setPrimaryBank = async (id: string) => {
    // Save current state to revert if something fails
    const previousBanks = [...banks];

    try {
      // Optimistic UI update
      setBanks((prev) =>
        prev.map((b) => ({
          ...b,
          is_primary: b.id === id,
          is_substitute: b.id !== id,
        }))
      );

      // Separate main and substitute updates
      const mainBankPromise = updateBank({
        bank_id: Number(id),
        is_primary: true,
        is_substitute: false,
      });

      const subBankPromises = banks
        .filter((b) => b.id !== id)
        .map((bank) =>
          updateBank({
            bank_id: Number(bank.id),
            is_primary: false,
            is_substitute: true,
          })
        );
      console.log(subBankPromises, "promises");

      // Run all updates atomically
      await Promise.all([mainBankPromise, ...subBankPromises]);

      toast.success("Primary account updated successfully");
    } catch (error) {
      console.error("Failed to set primary bank:", error);

      // 🔄 Rollback to previous UI state
      setBanks(previousBanks);

      toast.error("Failed to update primary account");
    }
  };

  const handleCheckPassword = async () => {
    if (!password || password.length < 6) {
      toast.error("Input password or check password ");
      return;
    }
    try {
      const response = await checkPassword({
        password,
      });
      try {
        addBankAccount();
      } catch (error) {
        toast.success("Password verified successfully and bank account added");
      }
    } catch (error) {
      console.error("Password verification failed", error);
      toast.error("Password verification failed");
      return;
    }
  };
  // console.log("BANKS LOCALLY", banks);
  const primaryBank = banks.find((b) => b.is_primary);
  const substituteBanks = banks.filter((b) => b.is_substitute && !b.is_primary);
  // console.log(substituteBanks);

  const isAlreadyDefaultPaymentApp =
    userStore?.subaccount?.account_number === primaryBank?.account_number &&
    userStore?.subaccount?.subaccount_code;

  return (
    <div className="flex lg:px-10 py-4 flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Building2 size={24} /> Bank Details
        </h2>
        <Button disabled={banks.length >= 3} onClick={openAddBankModal}>
          <Plus className="mr-2 h-4 w-4 disabled:opacity-40 disabled:cursor-none" />{" "}
          Add Bank Account
        </Button>
      </div>

      {/* Primary Bank Section */}
      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 size={18} className="text-green-600" />
            Primary Receiving Account
          </div>
          {banks.length > 0 && (
            <Button
              disabled={isAlreadyDefaultPaymentApp}
              onClick={() => {
                if (!primaryBank || isAlreadyDefaultPaymentApp) {
                  return;
                }
                makeSubAccountFn({ bankId: primaryBank.id });
              }}
            >
              {isAlreadyDefaultPaymentApp
                ? "Already Your Default account"
                : "Set as default payment account"}
            </Button>
          )}
        </div>

        <Badge variant="secondary" className="text-xs">
          This is your main account where funds will be deposited
        </Badge>

        {primaryBank ? (
          <div className="border rounded-lg p-4 bg-green-50">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-lg">
                  {primaryBank.account_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {primaryBank.bank_name}
                </p>
                <p className="text-sm font-mono mt-1">
                  {primaryBank.account_number}
                </p>
              </div>
              <Badge className="bg-green-600">Primary</Badge>
            </div>
          </div>
        ) : (
          <div className="border rounded-lg p-4 bg-gray-50 text-center text-muted-foreground">
            No primary account set. Add a bank account to get started.
          </div>
        )}
      </Card>

      {/* Substitute Banks Section */}
      <Card className="p-4 space-y-4">
        <div className="flex items-center gap-2 font-medium">
          <AlertCircle size={18} className="text-blue-600" />
          Substitute Accounts
        </div>
        <Badge variant="secondary" className="text-xs">
          Backup accounts for receiving payments
        </Badge>

        {substituteBanks.length > 0 ? (
          <div className="space-y-2">
            {substituteBanks.map((bank) => (
              <div key={bank.id} className="border rounded-lg p-4 bg-blue-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{bank.account_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {bank.bank_name}
                    </p>
                    <p className="text-sm font-mono mt-1">
                      {bank.account_number}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-blue-100">
                    Substitute
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border rounded-lg p-4 bg-gray-50 text-center text-muted-foreground">
            No substitute accounts added
          </div>
        )}
      </Card>

      {/* All Bank Accounts Table */}
      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <Building2 size={18} /> All Bank Accounts
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-4 border-b pb-3 mb-3 font-medium text-sm">
              <div>Account Name</div>
              <div>Bank Name</div>
              <div>Account Number</div>
              <div>Status</div>
              <div className="text-right">Actions</div>
            </div>

            {/* Table Body */}
            {isFetching ? (
              <div className="grid gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 bg-gray-100 animate-pulse rounded"
                  />
                ))}
              </div>
            ) : banks.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No bank accounts added yet
              </div>
            ) : (
              banks.map((bank) => (
                <div
                  key={bank.id}
                  className="grid grid-cols-5 gap-4 py-4 border-b items-center hover:bg-gray-50"
                >
                  <div className="font-medium">{bank.account_name}</div>
                  <div>{bank.bank_name}</div>
                  <div className="font-mono text-sm">{bank.account_number}</div>
                  <div>
                    <div className="flex gap-1 flex-wrap">
                      {bank.is_primary && (
                        <Badge className="bg-green-600 text-xs">Primary</Badge>
                      )}
                      {bank.is_substitute && (
                        <Badge
                          variant="outline"
                          className="bg-blue-100 text-xs"
                        >
                          Substitute
                        </Badge>
                      )}
                      {!bank.is_primary && !bank.is_substitute && (
                        <Badge variant="outline" className="text-xs">
                          Regular
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    {!bank.is_primary && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPrimaryBank(bank.id)}
                      >
                        Set Primary
                      </Button>
                    )}

                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        removeBank(bank.id);
                        setDeleteBankModal(true);
                      }}
                      disabled={bank.is_primary}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>

      {/* Add Bank Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Add Bank Account</DialogTitle>
          </DialogHeader>

          <div
            className={cn(
              "grid gap-4 py-2",
              showPasswordEntering
                ? " opacity-40 pointer-events-none  _blur-2xl"
                : ""
            )}
          >
            <div className="grid gap-2">
              <Label htmlFor="bank-select">Select Bank</Label>
              <Select
                value={selectedBank?.code}
                onValueChange={(value) => {
                  console.log("vlaue", value);

                  setSelectedBank({
                    ...selectedBank,
                    bankCode: value,
                  });
                }}
              >
                <SelectTrigger id="bank-select">
                  <SelectValue placeholder="Choose your bank" />
                </SelectTrigger>
                <SelectContent>
                  {bankList &&
                    bankList?.map((bank: any, index: number) => (
                      <SelectItem key={bank?.code + index} value={bank?.code}>
                        {bank?.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="account-number">Account Number</Label>
              <Input
                id="account-number"
                placeholder="Enter 10-digit account number"
                maxLength={10}
                value={accountNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setAccountNumber(value);
                }}
              />
              {isVerifying && (
                <p className="text-xs text-muted-foreground">
                  Verifying account...
                </p>
              )}
            </div>

            {verifyAccountNumber?.account_name && (
              <div className="grid gap-2">
                <Label>Account Name</Label>
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="font-medium text-green-900">
                    {verifyAccountNumber?.account_name}
                  </p>
                  <p className="text-xs text-green-700 mt-1 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Verified
                  </p>
                </div>
              </div>
            )}

            <div className="grid gap-3 pt-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is-primary"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="is-primary" className="cursor-pointer">
                  Set as primary receiving account
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is-substitute"
                  checked={isSubstitute}
                  onChange={(e) => setIsSubstitute(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="is-substitute" className="cursor-pointer">
                  Set as substitute account
                </Label>
              </div>
            </div>
          </div>
          {showPasswordEntering && user?.Provider === "APP_AUTH" && (
            <div className="grid gap-2">
              <Label htmlFor="account-number">Enter Password</Label>
              <Input
                id="password"
                placeholder="Enter account password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              {isVerifying && (
                <p className="text-xs text-muted-foreground">
                  Verifying account...
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (showPasswordEntering) {
                  handleCheckPassword();
                } else {
                  setShowPasswordEntering(true);
                }
              }}
              disabled={
                !verifyAccountNumber?.account_name ||
                isVerifying ||
                checkingPassword ||
                addingBank
              }
            >
              {showPasswordEntering ? "Verify Password" : "Add Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDelete
        isOpen={deleteBankModal}
        onCancel={() => {
          setDeleteBankModal(false);
        }}
        isDeleting={deletingBank}
        onConfirm={async () => {
          try {
            await deleteBank({ bank_id: Number(idOfbankToBeDeleted) });
            toast.success("Bank account removed");
          } catch (error: any) {
            console.error("Failed to remove bank", error);
            toast.error(
              error?.response?.data?.error ?? "Failed to remove bank account"
            );
          } finally {
            setDeleteBankModal(false);
          }
        }}
      />
    </div>
  );
}
