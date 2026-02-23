export const inMaintenance = import.meta.env.VITE_MAINTENANCE_MODE == "true";
export const isDevelopment = import.meta.env.VITE_ENVIRONMENT == "Development";

export const baseURL = isDevelopment
  ? import.meta.env.VITE_BACKEND_URL_DEVELOPMENT
  : import.meta.env.VITE_BACKEND_URL_PRODUCTION;
