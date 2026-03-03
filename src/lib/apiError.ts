/**
 * API Error utilities
 *
 * Provides consistent error message extraction from API responses
 */

import { AxiosError } from "axios";

/**
 * Extracts a user-friendly error message from an error object
 *
 * @param err - Error object (can be AxiosError, Error, or unknown)
 * @returns User-friendly error message string
 */
export const getApiErrorMessage = (
  error: AxiosError<{ message: string; errors?: { message: string }[] }>
) => {
  const response = error.response;
  let vineErrorMessage = null;
  if (response?.data?.errors && Array.isArray(response?.data?.errors)) {
    vineErrorMessage = response.data.errors
      ?.map((err: { message: string }) => err.message)
      .join(` \n`);
  } else if (response?.data?.message) {
    vineErrorMessage = response.data.message;
  } else if (response?.status === 429) {
    vineErrorMessage = 'Too many requests. Please try again later.';
  }
  return vineErrorMessage || error.response?.data.message || 'Something went wrong.';
};

// export function getApiErrorMessage(err: unknown): string {
//   if (axios.isAxiosError(err)) {
//     // Try to extract error message from response
//     const message = err.response?.data?.message || err.response?.data?.error;

//     if (message) {
//       return typeof message === "string" ? message : JSON.stringify(message);
//     }

//     // Fallback to status text or default message
//     if (err.response?.statusText) {
//       return err.response.statusText;
//     }

//     if (err.message) {
//       return err.message;
//     }
//   }

//   if (err instanceof Error) {
//     return err.message;
//   }

//   return "An unexpected error occurred. Please try again.";
// }