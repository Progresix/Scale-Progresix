"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/error-logger";

/**
 * Global Error Boundary
 * Catches unexpected errors in the entire application
 * Shows a user-friendly error page with recovery options
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to our error logger
    logger.error(error, {
      component: "GlobalErrorBoundary",
      action: "unexpected_error",
    });
  }, [error]);

  return (
    <html lang="id">
      <body className="bg-background text-foreground">
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full"
          >
            <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-lg">
              {/* Error Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center"
              >
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </motion.div>

              {/* Error Title */}
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-foreground mb-2"
              >
                Terjadi Kesalahan
              </motion.h1>

              {/* Error Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground mb-6"
              >
                Maaf, terjadi kesalahan yang tidak terduga. Tim kami telah
                diberitahu tentang masalah ini.
              </motion.p>

              {/* Error ID (for support) */}
              {error.digest && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mb-6 p-3 bg-muted rounded-lg"
                >
                  <p className="text-xs text-muted-foreground">
                    Error ID: <code className="font-mono">{error.digest}</code>
                  </p>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-3 justify-center"
              >
                <Button
                  onClick={reset}
                  variant="default"
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Coba Lagi
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="gap-2"
                >
                  <Link href="/">
                    <Home className="w-4 h-4" />
                    Ke Beranda
                  </Link>
                </Button>
              </motion.div>

              {/* Back Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-6"
              >
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  <Link href="javascript:history.back()">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali ke Halaman Sebelumnya
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Help Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-center text-sm text-muted-foreground"
            >
              Jika masalah berlanjut, silakan{" "}
              <Link href="/contact" className="text-primary hover:underline">
                hubungi tim support
              </Link>
            </motion.p>
          </motion.div>
        </div>
      </body>
    </html>
  );
}
