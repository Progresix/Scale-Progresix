"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  XCircle,
  ArrowLeft,
  Mail,
  Loader2,
  RefreshCw,
  FileQuestion,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

function DownloadErrorContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("code");
  const orderId = searchParams.get("order_id");
  
  const [email, setEmail] = useState("");
  const [inputOrderId, setInputOrderId] = useState(orderId || "");
  const [isResending, setIsResending] = useState(false);

  const getErrorMessage = () => {
    switch (errorCode) {
      case "expired":
        return {
          title: "Link Download Kedaluwarsa",
          description: "Link download yang Anda gunakan telah melewati batas waktu (7 hari). Silakan minta link baru melalui email.",
          icon: <XCircle className="h-12 w-12 text-red-500" />,
        };
      case "not_found":
        return {
          title: "File Tidak Ditemukan",
          description: "File yang Anda cari tidak ditemukan di server kami. Mungkin file telah dipindahkan atau dihapus.",
          icon: <FileQuestion className="h-12 w-12 text-amber-500" />,
        };
      case "access_denied":
        return {
          title: "Akses Ditolak",
          description: "Anda tidak memiliki izin untuk mengakses file ini. Pastikan Anda telah melakukan pembayaran yang valid.",
          icon: <XCircle className="h-12 w-12 text-red-500" />,
        };
      default:
        return {
          title: "Gagal Mengunduh File",
          description: "Terjadi kesalahan saat mencoba mengunduh file. Silakan coba lagi atau hubungi support.",
          icon: <XCircle className="h-12 w-12 text-gray-500" />,
        };
    }
  };

  const errorInfo = getErrorMessage();

  const handleResendEmail = async () => {
    if (!email || !inputOrderId) {
      toast.error("Email dan Order ID harus diisi");
      return;
    }

    setIsResending(true);
    try {
      const response = await fetch("/api/resend-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          orderId: inputOrderId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Email berhasil dikirim! Cek inbox Anda.");
      } else if (response.status === 429) {
        toast.error(result.error || "Terlalu banyak permintaan. Coba lagi nanti.");
      } else {
        toast.error(result.error || "Gagal mengirim email");
      }
    } catch (error) {
      console.error("Error resending email:", error);
      toast.error("Terjadi kesalahan");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Error Card */}
        <Card className="border-gray-200 dark:border-gray-800 text-center mb-6">
          <CardContent className="pt-8 pb-6">
            {/* Error Icon */}
            <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
              {errorInfo.icon}
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {errorInfo.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {errorInfo.description}
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

        {/* Request New Link Card */}
        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Minta Link Baru
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Masukkan email dan Order ID untuk menerima link download baru
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-900 dark:text-white">
                  Email Pembeli
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orderId" className="text-gray-900 dark:text-white">
                  Order ID
                </Label>
                <Input
                  id="orderId"
                  value={inputOrderId}
                  onChange={(e) => setInputOrderId(e.target.value)}
                  placeholder="INV-xxxxx-xxxxx"
                  className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                />
              </div>
              <Button
                onClick={handleResendEmail}
                disabled={isResending}
                className="w-full"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Kirim Link Baru
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Butuh bantuan lebih lanjut?{" "}
          <a
            href="mailto:support@scaleprogresix.com"
            className="text-gray-900 dark:text-white hover:underline"
          >
            Hubungi Support
          </a>
        </p>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
    </div>
  );
}

export default function DownloadErrorPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DownloadErrorContent />
    </Suspense>
  );
}
