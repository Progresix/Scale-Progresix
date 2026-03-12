"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  ShoppingCart,
  Package,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import toast from "react-hot-toast";
import { loadMidtransSnap, openSnapPopup, type SnapResult } from "@/lib/midtrans-client";
import type { Product } from "@/types/database";

const checkoutSchema = z.object({
  guestName: z.string().min(2, "Nama minimal 2 karakter"),
  guestEmail: z.string().email("Email tidak valid"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productSlug = searchParams.get("product");

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  // Fetch product details
  useEffect(() => {
    if (!productSlug) {
      setProductError("Produk tidak ditemukan");
      setIsLoadingProduct(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productSlug}`);
        if (!response.ok) {
          throw new Error("Produk tidak ditemukan");
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setProductError("Produk tidak ditemukan");
      } finally {
        setIsLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [productSlug]);

  const handlePaymentSuccess = (result: SnapResult) => {
    console.log("Payment success:", result);
    router.push(`/payment/success?order_id=${result.order_id}`);
  };

  const handlePaymentPending = (result: SnapResult) => {
    console.log("Payment pending:", result);
    router.push(`/payment/pending?order_id=${result.order_id}`);
  };

  const handlePaymentError = (result: SnapResult) => {
    console.error("Payment error:", result);
    toast.error("Pembayaran gagal. Silakan coba lagi.");
    router.push(`/payment/error?order_id=${result.order_id}`);
  };

  const handlePaymentClose = () => {
    setIsSubmitting(false);
    toast("Pembayaran dibatalkan. Anda dapat mencoba lagi.", {
      icon: "ℹ️",
    });
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (!product) return;

    setIsSubmitting(true);

    try {
      // Create transaction
      const response = await fetch("/api/create-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productSlug: product.slug,
          guestName: data.guestName,
          guestEmail: data.guestEmail,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal membuat transaksi");
      }

      // Check if we have a snap token (Midtrans configured)
      if (result.snapToken) {
        // Load Midtrans Snap script
        await loadMidtransSnap();

        // Open Snap popup
        openSnapPopup(result.snapToken, {
          onSuccess: handlePaymentSuccess,
          onPending: handlePaymentPending,
          onError: handlePaymentError,
          onClose: handlePaymentClose,
        });
      } else {
        // Demo mode - simulate success
        toast.success("Demo mode: Transaksi berhasil dibuat!");
        router.push(`/payment/success?order_id=${result.orderId}&demo=true`);
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
      setIsSubmitting(false);
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <Package className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Produk Tidak Ditemukan
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-center">
          {productError || "Produk yang Anda cari tidak tersedia"}
        </p>
        <Link href="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Produk
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Checkout
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Lengkapi data Anda untuk melanjutkan pembayaran
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Informasi Pembeli
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Masukkan data Anda untuk menerima produk digital
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="guestName" className="text-gray-900 dark:text-white">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="guestName"
                      {...register("guestName")}
                      placeholder="Masukkan nama lengkap Anda"
                      className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                      disabled={isSubmitting}
                    />
                    {errors.guestName && (
                      <p className="text-sm text-red-500">{errors.guestName.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="guestEmail" className="text-gray-900 dark:text-white">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="guestEmail"
                      type="email"
                      {...register("guestEmail")}
                      placeholder="email@example.com"
                      className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                      disabled={isSubmitting}
                    />
                    {errors.guestEmail && (
                      <p className="text-sm text-red-500">{errors.guestEmail.message}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Link download akan dikirim ke email ini
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Bayar Sekarang
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-gray-200 dark:border-gray-800 sticky top-4">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Ringkasan Pesanan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Product */}
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg bg-gray-100 dark:bg-gray-800 flex-shrink-0 overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Produk Digital
                    </p>
                  </div>
                </div>

                <Separator className="bg-gray-200 dark:bg-gray-700" />

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Harga</span>
                    <span className="text-gray-900 dark:text-white">{formatCurrency(product.price)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Jumlah</span>
                    <span className="text-gray-900 dark:text-white">1x</span>
                  </div>
                </div>

                <Separator className="bg-gray-200 dark:bg-gray-700" />

                {/* Total */}
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-gray-900 dark:text-white">
                    {formatCurrency(product.price)}
                  </span>
                </div>

                {/* Security Badge */}
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div className="text-xs">
                    <p className="font-medium text-green-800 dark:text-green-300">
                      Pembayaran Aman
                    </p>
                    <p className="text-green-600 dark:text-green-400">
                      Dilindungi enkripsi SSL
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutContent />
    </Suspense>
  );
}
