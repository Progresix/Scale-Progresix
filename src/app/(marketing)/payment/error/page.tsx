"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  XCircle,
  ArrowLeft,
  RefreshCw,
  Loader2,
} from "lucide-react";

function PaymentErrorContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div className="max-w-md mx-auto">
      {/* Error Card */}
      <Card className="border-gray-200 dark:border-gray-800 text-center">
        <CardContent className="pt-8 pb-6">
          {/* Error Icon */}
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Pembayaran Gagal
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Maaf, pembayaran Anda tidak dapat diproses. Silakan coba lagi atau gunakan metode pembayaran lain.
          </p>

          {/* Order Info */}
          {orderId && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6 text-left">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Order ID</span>
                <span className="font-mono text-gray-900 dark:text-white">
                  {orderId}
                </span>
              </div>
            </div>
          )}

          {/* Error Tips */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-medium text-red-800 dark:text-red-200 mb-2">
              Kemungkinan Penyebab:
            </h3>
            <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
              <li>• Saldo tidak mencukupi</li>
              <li>• Kartu kedaluwarsa atau diblokir</li>
              <li>• Koneksi internet terputus</li>
              <li>• Batas waktu pembayaran habis</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link href="/" className="block">
              <Button className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Coba Lagi
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Help Text */}
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        Butuh bantuan?{" "}
        <a
          href="mailto:support@scaleprogresix.com"
          className="text-gray-900 dark:text-white hover:underline"
        >
          Hubungi Support
        </a>
      </p>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
    </div>
  );
}

export default function PaymentErrorPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <Suspense fallback={<LoadingFallback />}>
        <PaymentErrorContent />
      </Suspense>
    </div>
  );
}
