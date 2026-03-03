/**
 * Auth React Query mutations
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { sendMagicLink, signOut } from "@/src/api/auth.api";
import { qk } from "./keys";
import { getApiErrorMessage } from "@/src/lib/apiError";
import { AxiosError } from "axios";

/**
 * Send magic link email for passwordless login
 */
export function useSendMagicLink() {
  return useMutation<void, AxiosError<{ message: string; errors?: { message: string }[] }>, string>({
    mutationFn: sendMagicLink,
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

/**
 * Sign out current user
 * Invalidates auth cache on success
 */
export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message: string; errors?: { message: string }[] }>, void>({
    mutationFn: signOut,
    onSuccess: () => {
      // Invalidate auth cache
      queryClient.invalidateQueries({ queryKey: qk.auth.me });
      // Optionally clear all queries
      // queryClient.clear();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
