"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Loader2,
  Mail,
  Calendar,
  CreditCard,
  User,
  Package,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import type { Transaction, Product } from "@/types/database";

type TransactionWithProduct = Transaction & { product: Product };

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusConfig = (status: string) => {
  const configs: Record<string, { bg: string; text: string; label: string; icon: React.ReactNode }> = {
    success: {
      bg: "bg-green-500/10",
      text: "text-green-600 dark:text-green-400",
      label: "Pembayaran Berhasil",
      icon: <CheckCircle className="h-5 w-5" />,
    },
    pending: {
      bg: "bg-yellow-500/10",
      text: "text-yellow-600 dark:text-yellow-400",
      label: "Menunggu Pembayaran",
      icon: <Clock className="h-5 w-5" />,
    },
    failed: {
      bg: "bg-red-500/10",
      text: "text-red-600 dark:text-red-400",
      label: "Pembayaran Gagal",
      icon: <XCircle className="h-5 w-5" />,
    },
    expired: {
      bg: "bg-gray-500/10",
      text: "text-gray-600 dark:text-gray-400",
      label: "Transaksi Expired",
      icon: <AlertCircle className="h-5 w-5" />,
    },
  };
  return configs[status] || configs.pending;
};

const getPaymentTypeLabel = (type: string | null) => {
  if (!type) return "-";
  const types: Record<string, string> = {
    bank_transfer: "Transfer Bank",
    credit_card: "Kartu Kredit",
    gopay: "GoPay",
    ovo: "OVO",
    dana: "DANA",
    shopeepay: "ShopeePay",
    qris: "QRIS",
    cstore: "Convenience Store",
  };
  return types[type] || type;
};

export default function TransactionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const transactionId = params.id as string;

  const [transaction, setTransaction] = useState<TransactionWithProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showResendDialog, setShowResendDialog] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await fetch(`/api/admin/transactions/${transactionId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch transaction");
        }
        const data = await response.json();
        setTransaction(data.data);
      } catch (error) {
        console.error("Error fetching transaction:", error);
        toast.error("Gagal memuat data transaksi");
        router.push("/dashboard/admin/transactions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId, router]);

  const handleResendEmail = async () => {
    if (!transaction) return;

    setIsResending(true);
    try {
      const response = await fetch("/api/resend-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: transaction.guest_email,
          orderId: transaction.midtrans_order_id,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Email berhasil dikirim ulang!");
        setShowResendDialog(false);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Transaksi tidak ditemukan</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/dashboard/admin/transactions")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Daftar Transaksi
        </Button>
      </div>
    );
  }

  const statusConfig = getStatusConfig(transaction.status);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/admin/transactions">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Detail Transaksi
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-mono text-sm">
              {transaction.midtrans_order_id || transaction.id}
            </p>
          </div>
        </div>
        {transaction.status === "success" && (
          <Button onClick={() => setShowResendDialog(true)}>
            <Send className="mr-2 h-4 w-4" />
            Kirim Ulang Email
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Card */}
        <Card className="border-gray-200 dark:border-gray-800 lg:col-span-3">
          <CardContent className="pt-6">
            <div className={`flex items-center gap-3 p-4 rounded-lg ${statusConfig.bg}`}>
              <div className={statusConfig.text}>{statusConfig.icon}</div>
              <div>
                <p className={`font-semibold ${statusConfig.text}`}>{statusConfig.label}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Terakhir diperbarui: {formatDate(transaction.updated_at)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Details */}
        <Card className="border-gray-200 dark:border-gray-800 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Informasi Transaksi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
                <p className="font-mono text-gray-900 dark:text-white">
                  {transaction.midtrans_order_id || transaction.id}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <Badge className={`${statusConfig.bg} ${statusConfig.text}`}>
                  {statusConfig.label}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Jumlah</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Metode Pembayaran</p>
                <p className="text-gray-900 dark:text-white">
                  {getPaymentTypeLabel(transaction.payment_type)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Dibuat</p>
                <p className="text-gray-900 dark:text-white">
                  {formatDate(transaction.created_at)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">ID Transaksi</p>
                <p className="font-mono text-gray-900 dark:text-white">
                  {transaction.id}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Details */}
        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
              <User className="h-5 w-5" />
              Informasi Pembeli
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Nama</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {transaction.guest_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="text-gray-900 dark:text-white">
                {transaction.guest_email}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Product Details */}
        <Card className="border-gray-200 dark:border-gray-800 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
              <Package className="h-5 w-5" />
              Produk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                {transaction.product?.image_url ? (
                  <img
                    src={transaction.product.image_url}
                    alt={transaction.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {transaction.product?.name || "Unknown Product"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {transaction.product?.description || "Tidak ada deskripsi"}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Slug: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{transaction.product?.slug}</code>
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Harga: {formatCurrency(transaction.product?.price || 0)}
                  </span>
                </div>
              </div>
              <Link
                href={`/products/${transaction.product?.slug}`}
                target="_blank"
              >
                <Button variant="outline" size="sm">
                  Lihat Produk
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resend Email Dialog */}
      <AlertDialog open={showResendDialog} onOpenChange={setShowResendDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kirim Ulang Email Konfirmasi</AlertDialogTitle>
            <AlertDialogDescription>
              Email konfirmasi dengan link download akan dikirim ke{" "}
              <strong>{transaction.guest_email}</strong> untuk order{" "}
              <strong>{transaction.midtrans_order_id}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isResending}>Batal</AlertDialogCancel>
            <AlertDialogAction
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
                  <Mail className="mr-2 h-4 w-4" />
                  Kirim Email
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
