"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/error-logger";

/**
 * Admin Error Boundary
 * Catches errors within the admin panel
 * Provides admin-specific recovery options
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error(error, {
      component: "AdminErrorBoundary",
      action: "admin_error",
    });
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full"
      >
        <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-lg">
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center"
          >
            <Shield className="w-10 h-10 text-red-500" />
          </motion.div>

          {/* Error Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-foreground mb-2"
          >
            Kesalahan Admin Panel
          </motion.h1>

          {/* Error Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground mb-6"
          >
            Terjadi kesalahan pada halaman admin. Ini mungkin disebabkan oleh
            masalah koneksi atau kesalahan sistem.
          </motion.p>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === "development" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-left overflow-auto"
            >
              <p className="text-xs font-mono text-red-600 dark:text-red-400">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs font-mono text-red-400 dark:text-red-500 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button onClick={reset} variant="destructive" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Coba Lagi
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/dashboard/admin">
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Admin
              </Link>
            </Button>
          </motion.div>

          {/* Help Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-sm text-muted-foreground"
          >
            Jika masalah berlanjut, silakan hubungi administrator sistem.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
