import axios from "axios";
import { baseURL } from "@context/EnvContext";
import { useEffect } from "react";
import { useLoader } from "@context/LoaderContext";
import { useNavigate } from "react-router-dom";

export const useAxiosPrivateAPI = () => {
  const { setIsLoading } = useLoader();
  const navigate = useNavigate();

  const backend = axios.create({ baseURL, withCredentials: true });

  useEffect(() => {
    const resI = backend.interceptors.response.use(
      (r) => {
        setIsLoading(false);
        return r;
      },
      async (err) => {
        setIsLoading(false);
        const original = err.config;
        if (err.response?.status === 401 && !original._retry) {
          original._retry = true;
          try {
          } catch {
            navigate("/login", { replace: true });
          }
        }
        return Promise.reject(err);
      },
    );

    return () => {
      backend.interceptors.response.eject(resI);
    };
  }, [navigate, setIsLoading]);

  return { backendAPIPrivate: backend };
};
