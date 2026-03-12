"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/error-logger";

/**
 * Dashboard Error Boundary
 * Catches errors within the dashboard area
 * Provides dashboard-specific recovery options
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error(error, {
      component: "DashboardErrorBoundary",
      action: "dashboard_error",
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
            className="w-20 h-20 mx-auto mb-6 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center"
          >
            <AlertTriangle className="w-10 h-10 text-amber-500" />
          </motion.div>

          {/* Error Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-foreground mb-2"
          >
            Kesalahan Dashboard
          </motion.h1>

          {/* Error Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground mb-6"
          >
            Terjadi kesalahan saat memuat halaman dashboard. Silakan coba lagi
            atau kembali ke halaman utama dashboard.
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
            <Button onClick={reset} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Coba Lagi
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/dashboard">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard Utama
              </Link>
            </Button>
          </motion.div>

          {/* Secondary Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 pt-6 border-t border-border"
          >
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
            >
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Kembali ke Website
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
