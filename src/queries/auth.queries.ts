/**
 * Auth React Query hooks
 */

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/src/api/auth.api";
import { qk } from "./keys";
import type { User } from "@/src/types/api";

/**
 * Get current authenticated user
 * Returns null for guest users
 */
export function useAuthUser() {
  return useQuery<User | null>({
    queryKey: qk.auth.me,
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
