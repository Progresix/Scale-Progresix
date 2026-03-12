"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  ShoppingCart, 
  Package, 
  Star, 
  Shield, 
  Clock, 
  Download,
  ChevronLeft,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/shared/navbar";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { ShareButtons, NativeShareButton } from "@/components/shared/share-buttons";
import { ProductCard, ProductCardSkeleton } from "@/components/shared/product-card";
import type { Product } from "@/types/database";

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleBuyNow = async () => {
    setIsProcessing(true);
    // Redirect to checkout page
    window.location.href = `/checkout?product=${product.slug}`;
  };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://scaleprogresix.com";
  const productUrl = `${baseUrl}/products/${product.slug}`;

  const features = [
    { icon: Download, text: "Download Instan", desc: "Akses langsung setelah pembayaran" },
    { icon: Shield, text: "Garansi Produk", desc: "Jaminan kualitas atau uang kembali" },
    { icon: Clock, text: "Support 24/7", desc: "Bantuan kapan saja Anda butuhkan" },
  ];

  return (
    <>
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/#products" className="hover:text-gray-900 dark:hover:text-white transition-colors">
            Produk
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium">{product.name}</span>
        </nav>

        {/* Back Button */}
        <Link 
          href="/#products"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Kembali ke Produk
        </Link>

        {/* Product Detail */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package className="h-24 w-24 text-gray-400 dark:text-gray-600" />
                </div>
              )}
              
              {/* Status Badge */}
              {!product.is_active && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge variant="destructive" className="text-sm">
                    Tidak Tersedia
                  </Badge>
                </div>
              )}
            </div>

            {/* Share Buttons (Mobile) */}
            <div className="flex items-center gap-2 mt-4 lg:hidden">
              <NativeShareButton
                url={productUrl}
                title={product.name}
                description={product.description || undefined}
              />
            </div>
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Title & Price */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="font-medium">4.9</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">(128 ulasan)</span>
                </div>
                <Badge variant="secondary">
                  <Tag className="h-3 w-3 mr-1" />
                  Produk Digital
                </Badge>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Harga</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">
                {formatPrice(product.price)}
              </p>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Deskripsi
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <feature.icon className="h-5 w-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {feature.text}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="flex-1 gap-2"
                disabled={!product.is_active || isProcessing}
                onClick={handleBuyNow}
              >
                <ShoppingCart className="h-5 w-5" />
                {isProcessing ? "Memproses..." : "Beli Sekarang"}
              </Button>
              
              {/* Share Buttons (Desktop) */}
              <div className="hidden lg:block">
                <ShareButtons
                  url={productUrl}
                  title={product.name}
                  description={product.description || undefined}
                  variant="dropdown"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Produk Lainnya
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          © 2024 Scale Progresix. All rights reserved.
        </div>
      </footer>
    </>
  );
}
