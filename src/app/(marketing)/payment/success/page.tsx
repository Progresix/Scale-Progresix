"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CheckCircle,
  Download,
  Mail,
  Loader2,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order_id");
  const isDemo = searchParams.get("demo") === "true";

  const [isLoading, setIsLoading] = useState(true);
  const [transaction, setTransaction] = useState<{
    order_id: string;
    guest_email: string;
    guest_name: string;
    product_name: string;
    amount: number;
    status: string;
  } | null>(null);
  const [showResendModal, setShowResendModal] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [resendOrderId, setResendOrderId] = useState("");
  const [isResending, setIsResending] = useState(false);

  // Fetch transaction details
  useState(() => {
    if (!orderId) {
      setIsLoading(false);
      return;
    }

    const fetchTransaction = async () => {
      try {
        const response = await fetch(`/api/transactions/${orderId}`);
        if (response.ok) {
          const data = await response.json();
          setTransaction(data);
          setResendEmail(data.guest_email);
          setResendOrderId(data.order_id || orderId);
        }
      } catch (error) {
        console.error("Error fetching transaction:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransaction();
  });

  const handleResendEmail = async () => {
    if (!resendEmail || !resendOrderId) {
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
          email: resendEmail,
          orderId: resendOrderId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Email berhasil dikirim ulang!");
        setShowResendModal(false);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Success Card */}
      <Card className="border-gray-200 dark:border-gray-800 text-center">
        <CardContent className="pt-8 pb-6">
          {/* Success Icon */}
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Pembayaran Berhasil!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Terima kasih telah berbelanja. Cek email kamu untuk link download produk.
          </p>

          {/* Order Info */}
          {transaction && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Order ID</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {orderId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Produk</span>
                  <span className="text-gray-900 dark:text-white">
                    {transaction.product_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Email</span>
                  <span className="text-gray-900 dark:text-white">
                    {transaction.guest_email}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Demo Mode Notice */}
          {isDemo && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Demo Mode:</strong> Ini adalah simulasi pembayaran. 
                Tidak ada email yang dikirim dan tidak ada transaksi nyata.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Button
              className="w-full"
              onClick={() => setShowResendModal(true)}
            >
              <Mail className="mr-2 h-4 w-4" />
              Kirim Ulang Email
            </Button>
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

      {/* Resend Email Modal */}
      <AlertDialog open={showResendModal} onOpenChange={setShowResendModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kirim Ulang Email</AlertDialogTitle>
            <AlertDialogDescription>
              Masukkan email dan Order ID untuk menerima link download produk.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="resend-email">Email</Label>
              <Input
                id="resend-email"
                type="email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resend-order">Order ID</Label>
              <Input
                id="resend-order"
                value={resendOrderId}
                onChange={(e) => setResendOrderId(e.target.value)}
                placeholder="INV-xxxxx-xxxxx"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowResendModal(false)}
              >
                Batal
              </Button>
              <Button
                className="flex-1"
                onClick={handleResendEmail}
                disabled={isResending}
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Kirim
                  </>
                )}
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
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

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <Suspense fallback={<LoadingFallback />}>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}
