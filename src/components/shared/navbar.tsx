"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Package } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-950/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-gray-900 dark:bg-white p-2 rounded-lg">
            <Package className="h-5 w-5 text-white dark:text-gray-900" />
          </div>
          <span className="font-bold text-xl text-gray-900 dark:text-white">
            Scale Progresix
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#products" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            Produk
          </Link>
          <Link href="#features" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            Fitur
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
