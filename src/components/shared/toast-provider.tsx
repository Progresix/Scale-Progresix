"use client";

import { Toaster as HotToaster } from "react-hot-toast";

/**
 * ToastProvider Component
 * Configures react-hot-toast with custom styling
 * Supports dark mode
 */
export function ToastProvider() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "var(--toast-bg, #ffffff)",
          color: "var(--toast-color, #1f2937)",
          border: "1px solid var(--toast-border, #e5e7eb)",
          borderRadius: "0.75rem",
          padding: "1rem",
          fontSize: "0.875rem",
          maxWidth: "400px",
        },
        className: "toast-container",
        success: {
          iconTheme: {
            primary: "#10b981",
            secondary: "#ffffff",
          },
          style: {
            borderLeft: "4px solid #10b981",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#ffffff",
          },
          style: {
            borderLeft: "4px solid #ef4444",
          },
        },
        loading: {
          iconTheme: {
            primary: "#6b7280",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}

/**
 * Toast utility functions
 * Wrapper around react-hot-toast for consistent usage
 */
import toast from "react-hot-toast";

export const showToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  loading: (message: string) => toast.loading(message),
  dismiss: (toastId?: string) => toast.dismiss(toastId),
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => toast.promise(promise, messages),
  custom: (content: React.ReactNode, options?: Record<string, unknown>) =>
    toast.custom(content, options),
};
