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

// Checkout email verification hooks
export const useCheckUserExists = () => {
  return useMutation({
    mutationFn: checkUserExists,
  });
};

export const useCreatePendingUser = () => {
  return useMutation({
    mutationFn: createPendingUser,
  });
};

export const useResendOTP = () => {
  return useMutation({
    mutationFn: resendOTP,
  });
};

export const useVerifyOTP = () => {
  return useMutation({
    mutationFn: verifyOTP,
  });
};

// Address management hooks
export const useFetchUserAddresses = () => {
  return useMutation({
    mutationFn: fetchUserAddresses,
  });
};

export const useAddUserAddress = () => {
  return useMutation({
    mutationFn: addUserAddress,
  });
};
const registerUser = async (data: { email: string, password: string , name:string}): Promise<User> => {
  const response = await api.post(`/users/register`, data)
  return response.data.user
}
// const loginUserMail = async (data: { email: string, password: string }): Promise<User> => {
//   const response = await api.post(`/users/login-mail`, data)
//   return response.data.user
// }
const loginUserMail = async (data: { email: string, password: string }) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return response.json();
};

const verifyCode = async (data: { code: string}): Promise<any> => {
  const response = await api.post(`/users/verify-code`, data)
  return response.data.user
}

// Checkout email verification handlers
const checkUserExists = async (email: string): Promise<{ exists: boolean; verified: boolean; user?: User }> => {
  try {
    const response = await api.get(`/users/check-email?email=${encodeURIComponent(email)}`)
    return response.data
  } catch (error: any) {
    if (error.response?.status === 404) {
      return { exists: false, verified: false }
    }
    throw error
  }
}

const createPendingUser = async (data: { email: string; firstName: string; lastName: string }): Promise<User> => {
  const response = await api.post(`/users/create-pending`, {
    ...data,
    status: "pending_verification"
  })
  return response.data
}

const resendOTP = async (email: string): Promise<User> => {
  const response = await api.post(`/users/resend-otp`, { email })
  return response.data
}

const verifyOTP = async (data: { email: string; code: string }): Promise<any> => {
  const response = await api.post(`/users/verify-otp`, data)
  return response.data
}

// Address management handlers
const fetchUserAddresses = async (email: string): Promise<any> => {
  const response = await api.get(`/users/addresses?email=${encodeURIComponent(email)}`)
  return response.data
}

const addUserAddress = async (data: { 
  email: string; 
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    addressDescription?: string;
  }
}): Promise<any> => {
  const response = await api.post(`/users/addresses`, data)
  return response.data
}

const fetchUserStore = async (): Promise<any> => {
  console.log("got here")
  const response = await api.get(`mystore`)
  console.log("got here too")

  return response.data
}
const fetchSingleStore = async (storeId?:string): Promise<any> => {
  console.log("got here")
  const response = await api.get(`/stores/single/${storeId}`)
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
    queryKey: ['store'],
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
export const useFetchSingleStore = (name?:string) => {
  const {
    data,
    isLoading,
    error,
    isError,
  } = useQuery<any, Error>({
    queryKey: [`${name}-store`],
    queryFn: () => fetchSingleStore(name),
    retry: 1,
    enabled:!!name
  })

  return {
    store: data,
    isLoading,
    error,
    isError,
  }
}
