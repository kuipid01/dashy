import { Store } from "@/types/store";
import { api } from "../base";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const updateStore = async (store: Partial<Store>): Promise<Store> => {
  const response = await api.put(`/store/update`, store);
  return response.data;
};


export const useUpdateStore = () => {
  const query = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (store: Partial<Store>) => updateStore( store),
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["store"] });
    },
  });

  return {
    mutateAsync,
    isPending,
  };
};