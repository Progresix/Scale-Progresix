"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, MessageCircle, Mail } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { BackToTop } from "@/components/shared/back-to-top";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Banner messages for animation
const bannerMessages = [
  "Produk Digital Berkualitas",
  "Download Langsung",
  "Tanpa Registrasi",
  "Harga Terjangkau",
];

// Products data
const products = [
  {
    id: "1",
    name: "Website Template Pro",
    slug: "website-template-pro",
    description: "Template website modern dengan desain profesional untuk bisnis Anda",
    price: 299000,
    image_url: "https://images.unsplash.com/photo-1460925895917-aaf4b51bada8?w=800&h=600&fit=crop",
    is_active: true,
  },
  {
    id: "2",
    name: "E-Book Marketing Digital",
    slug: "ebook-marketing-digital",
    description: "Panduan lengkap marketing digital untuk pemula dan profesional",
    price: 99000,
    image_url: "https://images.unsplash.com/photo-150784272343-583f20270319?w=800&h=600&fit=crop",
    is_active: true,
  },
  {
    id: "3",
    name: "UI Kit Premium",
    slug: "ui-kit-premium",
    description: "Koleksi komponen UI siap pakai untuk project Anda",
    price: 199000,
    image_url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
    is_active: true,
  },
  {
    id: "4",
    name: "Source Code E-Commerce",
    slug: "source-code-ecommerce",
    description: "Source code lengkap website e-commerce siap deploy",
    price: 499000,
    image_url: "https://images.unsplash.com/photo-1633356122544-f134ef2944f0?w=800&h=600&fit=crop",
    is_active: true,
  },
  {
    id: "5",
    name: "Dashboard Admin Template",
    slug: "dashboard-admin-template",
    description: "Template dashboard admin dengan fitur lengkap dan responsif",
    price: 349000,
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    is_active: true,
  },
  {
    id: "6",
    name: "Landing Page Kit",
    slug: "landing-page-kit",
    description: "Koleksi landing page siap pakai untuk berbagai kebutuhan bisnis",
    price: 179000,
    image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
    is_active: true,
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

// Animated Banner Component
function AnimatedBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-zinc-800 to-zinc-700 dark:from-zinc-900 dark:to-zinc-800 border-b border-gray-700 dark:border-gray-700 py-4 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center h-6">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="text-sm font-semibold text-white dark:text-gray-200 text-center"
            >
              ✨ {bannerMessages[currentIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Search Bar Component
function SearchBar({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative max-w-md mx-auto mb-12"
    >
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400 pointer-events-none" />
      <Input
        type="text"
        placeholder="Cari produk..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-12 pr-4 py-3 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-zinc-500 dark:focus:border-gray-600 focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-800 transition-all duration-200"
      />
    </motion.div>
  );
}

// Product Card Component
function ProductCard({
  product,
}: {
  product: (typeof products)[0];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 h-full flex flex-col bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md">
        {/* Image Section */}
        <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-zinc-800">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Package className="h-12 w-12 text-gray-400 dark:text-gray-600" />
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Link href={`/products/${product.slug}`}>
              <Button variant="secondary" size="sm" className="gap-2 bg-white hover:bg-gray-100 text-black">
                Lihat Detail
              </Button>
            </Link>
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="p-4 flex flex-col flex-1">
          {/* Product Name */}
          <h3 className="font-semibold text-zinc-900 dark:text-white line-clamp-2 mb-2 text-base">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
            {product.description}
          </p>

          {/* Price and Action */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
            <span className="text-lg font-bold text-zinc-900 dark:text-white">
              Rp {formatPrice(product.price).replace("IDR", "").trim()}
            </span>
            <Link href={`/products/${product.slug}`}>
              <Button
                size="sm"
                disabled={!product.is_active}
                className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-gray-100"
              >
                Beli
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function MarketingPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
      <Navbar />

      {/* Animated Banner */}
      <AnimatedBanner />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-950">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent text-balance"
          >
            Toko Produk Digital Terpercaya
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed text-pretty"
          >
            Dapatkan ribuan produk digital berkualitas dengan harga terjangkau. Download langsung tanpa registrasi.
          </motion.p>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 px-4 flex-1 bg-white dark:bg-zinc-950">
        <div className="container mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-2 text-balance">
              Produk Pilihan Kami
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
              Jelajahi koleksi produk digital terbaik untuk kebutuhan Anda
            </p>
          </motion.div>

          {/* Search Bar */}
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          {/* Products Grid - 2 per row */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Package className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">
                Produk tidak ditemukan
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                Coba kata kunci pencarian lain
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer - Card-like Minimalistic */}
      <footer className="bg-gray-100 dark:bg-zinc-900 border-t border-gray-300 dark:border-gray-700 py-8 px-4 mt-auto">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Copyright */}
              <div className="text-center md:text-left">
                <p className="text-zinc-900 dark:text-white font-semibold mb-1 text-sm">
                  Scale Progresix
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  © 2026 Semua hak dilindungi.
                </p>
              </div>

              {/* Contact Links - WhatsApp & Email */}
              <div className="flex items-center gap-3 flex-wrap justify-center md:justify-end">
                <a
                  href="https://wa.me/62882008726475"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white transition-all duration-200 hover:shadow-md text-sm font-medium"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
                <a
                  href="mailto:progresix@outlook.co.id"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-700 dark:bg-zinc-700 hover:bg-zinc-800 dark:hover:bg-zinc-600 text-white transition-all duration-200 hover:shadow-md text-sm font-medium"
                  aria-label="Email"
                >
                  <Mail className="h-4 w-4" />
                  <span className="hidden sm:inline">Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
}
