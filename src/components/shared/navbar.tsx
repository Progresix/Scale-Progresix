"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-zinc-950 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-zinc-950/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo - Text only, no icon */}
        <Link href="/" className="flex items-center">
          <span className="font-bold text-xl text-zinc-900 dark:text-white">
            Scale Progresix
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-zinc-900 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            href="#products"
            className="text-sm font-medium text-gray-600 hover:text-zinc-900 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            Products
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-zinc-900 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            Admin Login
          </Link>
        </nav>

        {/* Theme Toggle on Right */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
