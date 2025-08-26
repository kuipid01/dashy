"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { api } from "../base";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie'
import { User } from "@/constants/types";
import { useMutation, useQuery } from "@tanstack/react-query";
export function useHandleGoogleLogin() {
  const [state, setState] = useState({
    loading: false,
    result: null,
    error: null,
  });

  const handleLogin = async () => {
    setState({ ...state, loading: true });

    try {
      const response = await api.get("users");
      setState({
        loading: false,
        result: response.data,
        error: null,
      });
    } catch (error: any) {
      setState({
        loading: false,
        result: null,
        error: error.message || "Something went wrong",
      });
    }
  };

  return {
    ...state,
    handleLogin,
  };
}
export function useHandleLogout() {


  const router = useRouter()
  const [state, setState] = useState({
    loading: false,
    result: null,
    error: null,
  });

  const handleLogout = async () => {
    setState({ ...state, loading: true });

    try {
      const response = await api.post("users/logout");
      setState({
        loading: false,
        result: response.data,
        error: null,
      });
      // Clear frontend cookies manually with the same path if set
      Cookies.remove('access_token', { path: '/' });  // Use the correct path
      Cookies.remove('refresh_token', { path: '/' }); // Use the correct path


      toast.success("Logout succesful")
      router.push('/login')
    } catch (error: any) {
      setState({
        loading: false,
        result: null,
        error: error.message || "Something went wrong",
      });
      toast.error("Logout failed", error)
    }
  };

  return {
    ...state,
    handleLogout,
  };
}



const fetchUser = async (): Promise<User> => {
  const response = await api.get(`/users/me`)
  return response.data.user
}

// 2️⃣Register User
export const useRegisterUser = () => {


  return useMutation({
    mutationFn: registerUser,

  });
};
// 2️⃣Register User
export const useVerifyCode = () => {


  return useMutation({
    mutationFn: verifyCode,

  });
};
export const useLoginUserMail = () => {


  return useMutation({
    mutationFn: loginUserMail,

  });
};
const registerUser = async (data: { email: string, password: string , name:string}): Promise<User> => {
  const response = await api.post(`/users/register`, data)
  return response.data.user
}
const loginUserMail = async (data: { email: string, password: string }): Promise<User> => {
  const response = await api.post(`/users/login-mail`, data)
  return response.data.user
}
const verifyCode = async (data: { code: string}): Promise<any> => {
  const response = await api.post(`/users/verify-code`, data)
  return response.data.user
}

const fetchUserStore = async (): Promise<any> => {
  console.log("got here")
  const response = await api.get(`mystore`)
  console.log("got here too")

  return response.data
}

export const useFetchUser = () => {
  const {
    data,
    isLoading,
    error,
    isError,
  } = useQuery<User, Error>({
    queryKey: ['current-user'],
    queryFn: fetchUser,
    retry: 1,
  })

  return {
    user: data,
    isLoading,
    error,
    isError,
  }
}
export const useFetchUserStore = () => {
  const {
    data,
    isLoading,
    error,
    isError,
  } = useQuery<any, Error>({
    queryKey: ['current-user-store-2'],
    queryFn: fetchUserStore,
    retry: 1,
  })

  return {
    store: data,
    isLoading,
    error,
    isError,
  }
}
