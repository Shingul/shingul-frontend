/**
 * @deprecated This file is deprecated. Use the new API architecture in src/api/ instead.
 *
 * Migration guide:
 * - Replace `apiFetch` with direct API functions from `@/src/api/*`
 * - Replace React Query hooks with hooks from `@/src/queries/*`
 * - See src/README.md for documentation
 *
 * This file is kept for backward compatibility during migration.
 */

export { httpClient as apiFetch } from "@/src/lib/http";
