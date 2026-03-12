"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Menu } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-700 dark:border-gray-700 bg-gray-50 dark:bg-zinc-950 backdrop-blur supports-[backdrop-filter]:bg-gray-50/95 dark:supports-[backdrop-filter]:bg-zinc-950/95">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo - Text only, no icon */}
        <Link href="/" className="flex items-center">
          <span className="font-bold text-xl bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Scale Progresix
          </span>
        </Link>

        {/* Navigation Links - Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 hover:text-zinc-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            href="#products"
            className="text-sm font-medium text-gray-700 hover:text-zinc-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200"
          >
            Produk
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-gray-700 hover:text-zinc-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200"
          >
            Admin Login
          </Link>
        </nav>

        {/* Right Side - Theme Toggle & Mobile Menu */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <nav className="md:hidden border-t border-gray-700 dark:border-gray-700 bg-gray-50 dark:bg-zinc-900">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-zinc-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="#products"
              className="text-sm font-medium text-gray-700 hover:text-zinc-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Produk
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 hover:text-zinc-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Admin Login
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
