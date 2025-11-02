
import { User } from "@/constants/types";
import { api } from "../base";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Security } from "@/types/security";
import { getUsersStores } from "../chat/api";
import { BankAccount } from "@/app/(protected)/user/pages/bank-dets";

const updateUser = async (user: Partial<User>): Promise<User> => {
  const response = await api.put(`/users/update`, user);
  return response.data;
};
const checkPassword = async (data: { password: string }): Promise<any> => {
  const response = await api.post(`/users/password-check`, data);
  return response.data;
};
const addBank = async (data: Omit<BankAccount, "id">): Promise<any> => {
  const response = await api.post(`/users/addBank`, data);
  return response.data;
};
const updateUserOnboardingStatus = async (hasCompletedOnboarding: boolean): Promise<User> => {
  const response = await api.put(`/users/update-onboarding-status`, {
    hasCompletedOnboarding
  });
  return response.data;
};

export type BankUpdateDto = {
  bank_id: Number
  is_primary: boolean,
  is_substitute: boolean
}
export type BankDeleteDto = {
  bank_id: Number
}
const updateBank = async (data: BankUpdateDto): Promise<User> => {
  const response = await api.put(`/users/updateBank`,data);
  return response.data;
};
const deleteBank = async (data: BankDeleteDto): Promise<User> => {
  const response = await api.delete(`/users/deleteBank/${data.bank_id}`);
  return response.data;
};
const updateUserSecurity = async (security_settings: Partial<Security>): Promise<Security> => {
  const response = await api.put(`/users/security`, security_settings);
  return response.data;
};
const getUserSecurity = async (): Promise<{ security_settings: Security }> => {
  const response = await api.get(`/users/security`);
  return response.data;
};
const getUserBanks = async (): Promise<{ banks: BankAccount[] }> => {
  const response = await api.get(`/users/getBanks`);
  return response.data;
};

export const useUpdateUser = () => {
  const query = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (user: Partial<User>) => updateUser(user),
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["current-user"] });
    },
  });

  return {
    mutateAsync,
    isPending,
  };
};
export const useCheckUserPassword = () => {
  const query = useQueryClient();
  const { mutateAsync, isPending, data } = useMutation({
    mutationFn: (data: { password: string }) => checkPassword(data),
    onSuccess: () => {
    },
  });

  return {
    mutateAsync,
    isPending,
    data
  };
};
export const useAddBank = () => {
  const query = useQueryClient();
  const { mutateAsync, isPending, data } = useMutation({
    mutationFn: (data: Omit<BankAccount, "id">) => addBank(data),
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["banks"] });
    },
  });

  return {
    addBank: mutateAsync,
    addingBank: isPending,
    data
  };
};
export const useDeleteBank = () => {
  const query = useQueryClient();
  const { mutateAsync, isPending, data } = useMutation({
    mutationFn: (data: BankDeleteDto) => deleteBank(data),
    onSuccess: (_,variables) => {
      query.invalidateQueries({ queryKey: ["banks",variables.bank_id] });
    },
  });

  return {
    deleteBank: mutateAsync,
    deletingBank: isPending,
    data
  };
};
export const useUpdateBank = () => {
  const query = useQueryClient();
  const { mutateAsync, isPending, data } = useMutation({
    mutationFn: (data: BankUpdateDto) => updateBank(data),
    onSuccess: (_,variables) => {
      query.invalidateQueries({ queryKey: ["banks",variables.bank_id] });
    },
  });

  return {
    updateBank: mutateAsync,
    updatingBank: isPending,
    data
  };
};
export const useUpdateUserOnboardingStatus = () => {
  const query = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (hasCompletedOnboarding: boolean) => updateUserOnboardingStatus(hasCompletedOnboarding),
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["current-user"] });
    },
  });

  return {
    mutateAsync,
    isPending,
  };
};
export const useUpdateUserSecurity = () => {
  const query = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (settings: Partial<Security>) => updateUserSecurity(settings),
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["current-user-security"] });
    },
  });

  return {
    mutateAsync,
    isPending,
  };
};



export const useSearchUserStores = (query: string) => {
  return useQuery({
    queryKey: ["user-stores", query],
    queryFn: () => getUsersStores(query),
    enabled: query !== ""
  });
};

export const useGetUserSecurity = () => {
  return useQuery({
    queryKey: ["current-user-security"],
    queryFn: () => getUserSecurity(),

  });
};
export const useGetBanks = () => {
  return useQuery({
    queryKey: ["banks"],
    queryFn: () => getUserBanks(),

  });
};