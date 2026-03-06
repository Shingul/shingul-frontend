"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#F9F2E9",
            border: "1px solid rgba(102, 2, 60, 0.12)",
            color: "#1E1E1E",
            borderRadius: "12px",
            padding: "12px 16px",
            boxShadow: "0 4px 20px rgba(102, 2, 60, 0.08)",
          },
          success: {
            iconTheme: {
              primary: "#66023C",
              secondary: "#F9F2E9",
            },
            style: {
              border: "1px solid rgba(102, 2, 60, 0.2)",
              boxShadow: "0 4px 20px rgba(102, 2, 60, 0.12)",
            },
          },
          error: {
            iconTheme: {
              primary: "#B91C1C",
              secondary: "#F9F2E9",
            },
            style: {
              border: "1px solid rgba(185, 28, 28, 0.25)",
              boxShadow: "0 4px 20px rgba(185, 28, 28, 0.1)",
            },
          },
        }}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
