"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, Twitter, Instagram, Linkedin } from "lucide-react";
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
    image_url: null,
    is_active: true,
  },
  {
    id: "2",
    name: "E-Book Marketing Digital",
    slug: "ebook-marketing-digital",
    description: "Panduan lengkap marketing digital untuk pemula dan profesional",
    price: 99000,
    image_url: null,
    is_active: true,
  },
  {
    id: "3",
    name: "UI Kit Premium",
    slug: "ui-kit-premium",
    description: "Koleksi komponen UI siap pakai untuk project Anda",
    price: 199000,
    image_url: null,
    is_active: true,
  },
  {
    id: "4",
    name: "Source Code E-Commerce",
    slug: "source-code-ecommerce",
    description: "Source code lengkap website e-commerce siap deploy",
    price: 499000,
    image_url: null,
    is_active: true,
  },
  {
    id: "5",
    name: "Dashboard Admin Template",
    slug: "dashboard-admin-template",
    description: "Template dashboard admin dengan fitur lengkap dan responsif",
    price: 349000,
    image_url: null,
    is_active: true,
  },
  {
    id: "6",
    name: "Landing Page Kit",
    slug: "landing-page-kit",
    description: "Koleksi landing page siap pakai untuk berbagai kebutuhan bisnis",
    price: 179000,
    image_url: null,
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
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-zinc-800 dark:bg-zinc-900 border-b border-gray-700 dark:border-gray-700 py-3 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center h-6">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="text-sm font-medium text-gray-300 dark:text-gray-400"
            >
              {bannerMessages[currentIndex]}
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
    <div className="relative max-w-md mx-auto mb-12">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
      <Input
        type="text"
        placeholder="Cari produk..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-12 pr-4 py-6 rounded-full border-gray-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-gray-500 focus:ring-gray-500"
      />
    </div>
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
      <Card className="group overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition-colors h-full flex flex-col bg-white dark:bg-zinc-900">
        {/* Image Section */}
        <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-zinc-800">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Package className="h-12 w-12 text-gray-400 dark:text-gray-600" />
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Link href={`/products/${product.slug}`}>
              <Button variant="secondary" size="sm" className="gap-2">
                Lihat Detail
              </Button>
            </Link>
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="p-4 flex flex-col flex-1">
          {/* Product Name */}
          <h3 className="font-semibold text-zinc-900 dark:text-white line-clamp-2 mb-2">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
            {product.description}
          </p>

          {/* Price and Action */}
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
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
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-950">
      <Navbar />

      {/* Animated Banner */}
      <AnimatedBanner />

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-100 to-gray-50 dark:from-zinc-900 dark:to-zinc-800">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-zinc-900 dark:text-white"
          >
            Toko Produk Digital
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto"
          >
            Scale Progresix menyediakan berbagai produk digital premium dengan harga terjangkau
          </motion.p>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-12 px-4 flex-1 bg-white dark:bg-zinc-900">
        <div className="container mx-auto">
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
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Produk tidak ditemukan
              </p>
              <p className="text-gray-400 dark:text-gray-600 text-sm mt-2">
                Coba kata kunci lain
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer - Card-like Minimalistic */}
      <footer className="bg-gray-100 dark:bg-zinc-800 border-t border-gray-200 dark:border-gray-700 py-8 px-4 mt-auto">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white dark:bg-zinc-900/50 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Copyright */}
              <div className="text-center md:text-left">
                <p className="text-zinc-900 dark:text-white font-semibold mb-1">
                  Scale Progresix
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  © 2024 All rights reserved.
                </p>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-white dark:hover:text-white hover:bg-zinc-800 dark:hover:bg-zinc-600 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-white dark:hover:text-white hover:bg-zinc-800 dark:hover:bg-zinc-600 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-white dark:hover:text-white hover:bg-zinc-800 dark:hover:bg-zinc-600 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
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
