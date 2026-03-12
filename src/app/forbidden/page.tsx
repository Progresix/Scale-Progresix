"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldX, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        {/* Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30">
            <ShieldX className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          403 - Akses Ditolak
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. 
          Halaman ini hanya tersedia untuk administrator.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Beranda
            </Button>
          </Link>
          <Link href="/login">
            <Button className="w-full sm:w-auto gap-2">
              <Home className="h-4 w-4" />
              Login sebagai Admin
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
