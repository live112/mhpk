import { baseURL } from "@context/EnvContext";
import axios from "axios";

import { useEffect } from "react";

export const direcciones: Record<string, string> = {
  auth: "/auth",
  users: "/users",
  stories: "/stories",
  lines: "/lines",
};

export const useAxiosAPI = () => {
  const backendAPI = axios.create({ baseURL: baseURL });
  backendAPI.defaults.withCredentials = true;

  useEffect(() => {
    const requestInterceptor = backendAPI.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = backendAPI.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      backendAPI.interceptors.request.eject(requestInterceptor);
      backendAPI.interceptors.response.eject(responseInterceptor);
    };
  }, [backendAPI]);

  return {
    backendAPI,
  };
};
