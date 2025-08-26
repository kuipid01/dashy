import { Store } from "@/types/store";
import { api } from "../base";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const updateStore = async (store: Partial<Store>): Promise<Store> => {
  const response = await api.put(`/store/update`, store);
  return response.data;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const checkStoreName = async (name: string): Promise<any> => {
  const response = await api.post(`/store/check-name`, { name: name });
  return response.data;
};


export const useUpdateStore = () => {
  const query = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (store: Partial<Store>) => updateStore(store),
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["store"] });
    },
  });

  return {
    mutateAsync,
    isPending,
  };
};
export const useCheckStoreName = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (name: string) => checkStoreName(name),
   
  });

  return {
    mutateAsync,
    isPending,
  };
};

export const getStoreById = async (id: string): Promise<Store> => {
  const response = await api.get(`/store/${id}`);
  return response.data;
};

export const useFetchStoreById = (id: string) => {
  return useQuery({
    queryKey: ["store-by-id", id],
    queryFn: () => getStoreById(id),
    enabled: !!id
  });
};