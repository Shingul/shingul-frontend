# API Architecture Documentation

This directory contains the refactored API architecture for the Shingul frontend application.

## Directory Structure

```
src/
  lib/
    http.ts          # Preconfigured Axios client
    apiError.ts      # Error message utilities
  api/
    auth.api.ts      # Auth API functions
    studySets.api.ts # Study sets API functions
    documents.api.ts # Documents API functions
    index.ts         # Central API exports
  queries/
    keys.ts          # React Query key factory
    auth.queries.ts  # Auth query hooks
    auth.mutations.ts # Auth mutation hooks
    studySets.queries.ts # Study sets query hooks
    studySets.mutations.ts # Study sets mutation hooks
    documents.queries.ts # Documents query hooks
    documents.mutations.ts # Documents mutation hooks
  types/
    api.ts           # Shared API types
```

## Adding New Endpoints

### 1. Create API Function

Add your API function to the appropriate `src/api/*.api.ts` file:

```typescript
// src/api/example.api.ts
import { httpClient } from "@/src/lib/http";
import type { ExampleType } from "@/src/types/api";

export async function getExample(id: string): Promise<ExampleType> {
  const response = await httpClient.get<ExampleType>(`/examples/${id}`);
  return response.data; // Always return unwrapped data
}
```

**Rules:**

- Always return unwrapped data (not axios response)
- Use strong TypeScript types
- Handle FormData for file uploads
- Export from `src/api/index.ts`

### 2. Add Query Key

Add your query key to `src/queries/keys.ts`:

```typescript
export const qk = {
  // ... existing keys
  examples: {
    all: ["examples"] as const,
    details: () => [...qk.examples.all, "detail"] as const,
    detail: (id: string) => [...qk.examples.details(), id] as const,
  },
} as const;
```

**Rules:**

- Use nested structure by domain
- Always use `as const` for type safety
- Follow the pattern: `all` → `lists/details` → specific keys

### 3. Create Query Hook

Create `src/queries/example.queries.ts`:

```typescript
import { useQuery } from "@tanstack/react-query";
import { getExample } from "@/src/api/example.api";
import { qk } from "./keys";

export function useExample(id: string) {
  return useQuery({
    queryKey: qk.examples.detail(id),
    queryFn: () => getExample(id),
    enabled: !!id,
  });
}
```

### 4. Create Mutation Hook (if needed)

Create `src/queries/example.mutations.ts`:

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExample } from "@/src/api/example.api";
import { qk } from "./keys";

export function useCreateExample() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExample,
    onSuccess: (data) => {
      // Invalidate relevant caches
      queryClient.invalidateQueries({ queryKey: qk.examples.lists() });

      // Optionally seed detail cache
      queryClient.setQueryData(qk.examples.detail(data.id), data);
    },
  });
}
```

## Query Key Naming Convention

- **Lists**: `qk.domain.lists()` or `qk.domain.list(filters?)`
- **Details**: `qk.domain.details()` then `qk.domain.detail(id)`
- **Nested resources**: `qk.domain.byParent(parentId)`

Example:

```typescript
qk.studySets.list(); // All study sets
qk.studySets.detail("123"); // Single study set
qk.documents.byStudySet("123"); // Documents for study set
```

## Cache Invalidation

### When to Invalidate

- **After mutations**: Always invalidate related lists
- **After creates**: Optionally seed detail cache
- **After updates**: Update detail cache with `setQueryData`
- **After deletes**: Invalidate lists and remove detail cache

### Example

```typescript
onSuccess: (data) => {
  // Invalidate list
  queryClient.invalidateQueries({ queryKey: qk.studySets.lists() });

  // Seed detail cache
  queryClient.setQueryData(qk.studySets.detail(data.id), data);
};
```

## File Uploads

For endpoints that accept files, use `FormData`:

```typescript
export async function createWithFiles(payload: {
  title: string;
  files: File[];
}) {
  const formData = new FormData();
  formData.append("title", payload.title);
  payload.files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await httpClient.post("/endpoint", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
```

## Polling

For endpoints that need polling (e.g., document processing):

```typescript
export function useDocument(id: string) {
  return useQuery({
    queryKey: qk.documents.detail(id),
    queryFn: () => getDocument(id),
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return false;

      // Poll while processing
      if (data.status === "queued" || data.status === "extracting") {
        return 2000; // 2 seconds
      }

      // Stop when done
      return false;
    },
  });
}
```

## Error Handling

Use `getApiErrorMessage` for consistent error messages:

```typescript
import { getApiErrorMessage } from "@/src/lib/apiError";

try {
  await mutation.mutateAsync(data);
} catch (error) {
  const message = getApiErrorMessage(error);
  // Display message to user
}
```

## Environment Variables

Set `NEXT_PUBLIC_API_URL` in your `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3333/api
```

The HTTP client will fallback to `http://localhost:3333/api` if not set.

## Authentication

The HTTP client automatically:

- Attaches Bearer token from `localStorage.getItem("token")` if present
- Supports session cookies via `withCredentials: true` (for AdonisJS)

## Best Practices

1. **Keep API modules pure**: No React Query imports, no caching logic
2. **Type everything**: Use TypeScript types for all inputs/outputs
3. **Centralize keys**: Always use `qk` factory, never hardcode keys
4. **Handle errors**: Use `getApiErrorMessage` for user-facing errors
5. **Invalidate wisely**: Only invalidate what changed
6. **Seed caches**: Use `setQueryData` after creates/updates when possible
