/**
 * Auth API module
 *
 * Handles authentication-related API calls
 * All functions return unwrapped data (not axios response)
 */

import { httpClient } from "@/src/lib/http";
import type { User, AuthMeResponse } from "@/src/types/api";

/**
 * Get current authenticated user
 * Returns null if not authenticated (guest mode)
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await httpClient.get<AuthMeResponse>("/auth/me");
    return response.data.user;
  } catch {
    // Guest mode - return null instead of throwing
    return null;
  }
}

/**
 * Send magic link email for passwordless login
 */
export async function sendMagicLink(email: string): Promise<void> {
  await httpClient.post("/auth/email/start", { email });
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  await httpClient.post("/auth/logout");
}

// TODO: Add signUp endpoint when available
// export async function signUp(email: string, password: string): Promise<User> {
//   const response = await httpClient.post<User>("/auth/signup", { email, password });
//   return response.data;
// }
