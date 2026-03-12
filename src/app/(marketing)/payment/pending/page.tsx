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
  Clock,
  ArrowLeft,
  Loader2,
} from "lucide-react";

function PaymentPendingContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div className="max-w-md mx-auto">
      {/* Pending Card */}
      <Card className="border-gray-200 dark:border-gray-800 text-center">
        <CardContent className="pt-8 pb-6">
          {/* Pending Icon */}
          <div className="w-20 h-20 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mx-auto mb-6">
            <Clock className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Menunggu Pembayaran
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Pembayaran Anda sedang diproses. Silakan selesaikan pembayaran sesuai instruksi yang diberikan.
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

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              Langkah Selanjutnya:
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>1. Cek email Anda untuk instruksi pembayaran</li>
              <li>2. Selesaikan pembayaran sebelum waktu habis</li>
              <li>3. Link download akan dikirim setelah pembayaran berhasil</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
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
        Ada masalah?{" "}
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

export default function PaymentPendingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <Suspense fallback={<LoadingFallback />}>
        <PaymentPendingContent />
      </Suspense>
    </div>
  );
}
