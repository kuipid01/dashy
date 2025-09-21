/* eslint-disable @typescript-eslint/no-explicit-any */
import { LOCATION_MQ_BASE_URL_FORWARD, NG_DATA } from "@/constants/ng-data";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";



// 1️⃣ Define getStates as a function
export const getStates = async () => {
  try {
    console.log(process.env.NEXT_PUBLIC_NG_DATA_AUTH)
    const res = await axios.get(`${NG_DATA}/states`, {
      headers: {
        Authorization: `Bearer mgp5cG6kVyzllVXav9tROy9a0D9kJFYOnBMthBTL64d3e9f7`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return res.data; // return the data
  } catch (error) {
    console.error("Error fetching states:", error);
    return []; // return empty array on error
  }
};








export const ng_data = {

  states: ["states"] as const

};

// Queries
export const useGetNGStores = () => {
  return useQuery<any>({
    queryKey: ng_data.states,
    queryFn: () => getStates(),
  });
};



export const locations = {

  location: (query?: string) => ["locations", query]

};




export const getLocations = async (query?: string) => {
  try {
    const encodedQuery = encodeURIComponent(query ?? "");
    const res = await axios.get(
      `${LOCATION_MQ_BASE_URL_FORWARD}&q=${encodedQuery}&format=json&countrycodes=ng&addressdetails=1`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching states:", error);
    return [];
  }
};



export const useFetchLocations = (query?: string) => {
  return useQuery<any>({
    queryKey: locations.location(query),
    queryFn: () => getLocations(query),
    enabled: !!query
  });
}