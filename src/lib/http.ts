/**
 * Preconfigured Axios HTTP client
 *
 * Features:
 * - Automatic base URL from environment
 * - Request interceptor for auth token
 * - Response interceptor for error normalization
 * - Session cookie support for AdonisJS
 */

import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";

const API_URL =
  `${process.env.NEXT_PUBLIC_API_URL}/api` || "http://localhost:3333/api";
// const API_URL = "http://localhost:3333/api";
console.log("API_URL", API_URL);

// Create axios instance with default config
export const httpClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Required for AdonisJS session cookies
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor: attach auth token from localStora
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor: normalize errors
httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Normalize error structure
    // Optionally handle 401 here (e.g., clear token, redirect)
    // For now, we'll let components handle 401s as needed
    // TODO: Add 401 handling if needed (e.g., redirect to login)

    return Promise.reject(error);
  },
);
