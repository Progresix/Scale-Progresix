"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Package, Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/navbar";

export default function ProductNotFound() {
  return (
    <>
      <Navbar />
      
      <main className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          {/* Icon */}
          <div className="mb-8">
            <div className="relative inline-block">
              <Package className="h-32 w-32 text-gray-300 dark:text-gray-700" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold"
              >
                ?
              </motion.div>
            </div>
          </div>

          {/* Content */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Produk Tidak Ditemukan
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Maaf, produk yang Anda cari tidak tersedia atau telah dihapus. 
            Silakan kembali ke halaman produk atau gunakan fitur pencarian.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button variant="outline" className="w-full sm:w-auto gap-2">
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Button>
            </Link>
            <Link href="/#products">
              <Button className="w-full sm:w-auto gap-2">
                <Home className="h-4 w-4" />
                Lihat Semua Produk
              </Button>
            </Link>
          </div>

          {/* Suggestions */}
          <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-2">
              <Search className="h-4 w-4" />
              Mungkin Anda Mencari
            </h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {["Template Website", "E-Book", "UI Kit", "Software"].map((item) => (
                <Link
                  key={item}
                  href={`/#products`}
                  className="px-4 py-2 bg-white dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-200 dark:border-gray-600"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </>
  );
}
