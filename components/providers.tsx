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
            background: "rgba(11, 18, 48, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(234, 240, 255, 0.1)",
            color: "#EAF0FF",
            borderRadius: "12px",
            padding: "12px 16px",
            boxShadow: "0 0 20px rgba(109, 91, 255, 0.3)",
          },
          success: {
            iconTheme: {
              primary: "#2DE2FF",
              secondary: "#0B1230",
            },
            style: {
              border: "1px solid rgba(45, 226, 255, 0.3)",
              boxShadow: "0 0 20px rgba(45, 226, 255, 0.2)",
            },
          },
          error: {
            iconTheme: {
              primary: "#FF4FD8",
              secondary: "#0B1230",
            },
            style: {
              border: "1px solid rgba(255, 79, 216, 0.3)",
              boxShadow: "0 0 20px rgba(255, 79, 216, 0.2)",
            },
          },
        }}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
