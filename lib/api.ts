/**
 * This app uses Adonis session cookies; CORS on backend must allow credentials for localhost:3000.
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const BACKEND_URL = "http://localhost:3333/api";

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Helper function for making API requests to the AdonisJS backend
 * Automatically includes credentials and handles JSON parsing
 * Throws on non-2xx responses
 */
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> {
  try {
    const response = await axiosInstance.request<T>({
      url: endpoint,
      ...options,
    });
    return response;
  } catch (error) {
    // Axios throws for non-2xx responses, re-throw to let callers handle
    throw error;
  }
}
