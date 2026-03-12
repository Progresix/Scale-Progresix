"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Package, Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-gray-900 dark:bg-white p-4 rounded-2xl">
            <Package className="h-12 w-12 text-white dark:text-gray-900" />
          </div>
        </motion.div>

        {/* 404 Text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-8xl font-bold text-gray-900 dark:text-white mb-4"
        >
          404
        </motion.h1>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4"
        >
          Halaman Tidak Ditemukan
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gray-600 dark:text-gray-400 mb-8"
        >
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan. 
          Silakan kembali ke beranda atau gunakan navigasi.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto gap-2">
              <Home className="h-5 w-5" />
              Kembali ke Beranda
            </Button>
          </Link>
          <Link href="/#products">
            <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
              <Search className="h-5 w-5" />
              Lihat Produk
            </Button>
          </Link>
        </motion.div>

        {/* Additional Help */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-sm text-gray-500 dark:text-gray-400"
        >
          Butuh bantuan?{" "}
          <a
            href="mailto:support@scaleprogresix.com"
            className="text-gray-900 dark:text-white hover:underline"
          >
            Hubungi Support
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}
