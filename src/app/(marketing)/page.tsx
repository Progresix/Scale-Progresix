import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { AnimatedText } from "@/components/shared/animated-text";
import { FeaturesSection } from "@/components/shared/features-section";
import { ProductsSection } from "@/components/shared/products-section";
import { BackToTop } from "@/components/shared/back-to-top";

const heroMessages = [
  "Produk Digital",
  "Template Website",
  "E-Book Premium",
  "UI Kit Modern",
];

export default function MarketingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            Toko Produk Digital Terpercaya
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-gray-900 dark:text-white">
            Temukan{" "}
            <AnimatedText 
              messages={heroMessages}
              interval={2000}
              className="text-gray-600 dark:text-gray-300"
            />
            {" "}untuk Kebutuhan Anda
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Scale Progresix menyediakan berbagai produk digital premium dengan harga terjangkau dan pengiriman instan
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#products">
              <Button size="lg" className="w-full sm:w-auto">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Lihat Produk
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Horizontal */}
      <FeaturesSection />

      {/* Products Section */}
      <ProductsSection />

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-900 dark:bg-gray-800">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Siap Membeli Produk Digital?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Dapatkan produk digital berkualitas dengan harga terjangkau. Proses pembelian mudah dan cepat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#products">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Mulai Belanja
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 px-4 mt-auto">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-gray-900 dark:text-white" />
              <span className="font-semibold text-gray-900 dark:text-white">Scale Progresix</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Tentang Kami
              </Link>
              <Link href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Kebijakan Privasi
              </Link>
              <Link href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Kontak
              </Link>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2024 Scale Progresix. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
}
