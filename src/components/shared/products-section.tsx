"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package, Eye } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const products = [
  {
    id: "1",
    name: "Website Template Pro",
    slug: "website-template-pro",
    description: "Template website modern dengan desain profesional untuk bisnis Anda",
    price: 299000,
    image_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "E-Book Marketing Digital",
    slug: "ebook-marketing-digital",
    description: "Panduan lengkap marketing digital untuk pemula dan profesional",
    price: 99000,
    image_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "UI Kit Premium",
    slug: "ui-kit-premium",
    description: "Koleksi komponen UI siap pakai untuk project Anda",
    price: 199000,
    image_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Source Code E-Commerce",
    slug: "source-code-ecommerce",
    description: "Source code lengkap website e-commerce siap deploy",
    price: 499000,
    image_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function ProductsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="products"
      ref={ref}
      className="py-20 px-4 bg-white dark:bg-gray-950"
    >
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Produk Unggulan
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Pilihan produk digital terbaik untuk mendukung kebutuhan Anda
          </p>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <Card className="group overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-xl dark:hover:shadow-gray-900/20 transition-all duration-300 h-full flex flex-col bg-white dark:bg-gray-900">
                {/* Image Section */}
                <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Package className="h-12 w-12 text-gray-400 dark:text-gray-600 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  )}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <Link href={`/products/${product.slug}`}>
                      <Button variant="secondary" size="sm" className="gap-2 shadow-lg">
                        <Eye className="h-4 w-4" />
                        Lihat Detail
                      </Button>
                    </Link>
                  </div>

                  {/* Status Badge */}
                  {!product.is_active && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="destructive" className="text-xs">
                        Tidak Tersedia
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <CardContent className="p-4 flex flex-col flex-1">
                  {/* Product Name */}
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                    {product.name}
                  </h3>

                  {/* Description */}
                  {product.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
                      {product.description}
                    </p>
                  )}

                  {/* Price and Action */}
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <Link href={`/products/${product.slug}`}>
                      <Button
                        size="sm"
                        disabled={!product.is_active}
                        className="gap-1 transition-transform hover:scale-105"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Beli
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
