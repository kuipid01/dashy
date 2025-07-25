
import { User } from "@/constants/types";
import { api } from "../base";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Security } from "@/types/security";
import { getUsersStores } from "../chat/api";

const updateUser = async (user: Partial<User>): Promise<User> => {
  const response = await api.put(`/users/update`, user);
  return response.data;
};
const updateUserSecurity = async (security_settings: Partial<Security>): Promise<Security> => {
  const response = await api.put(`/users/security`, security_settings);
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



export const useSearchUserStores = (query:string) => {
  return useQuery({
    queryKey: ["user-stores", query],
    queryFn: () => getUsersStores(query),
    enabled:query!==""
  });
};