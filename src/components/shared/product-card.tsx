"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Eye, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/database";

interface ProductCardProps {
  product: Product;
  onViewDetails?: (productId: string) => void;
  className?: string;
}

/**
 * ProductCard Component
 * Displays product information with image, name, price, and actions
 * Supports dark mode and responsive design
 */
export function ProductCard({
  product,
  onViewDetails,
  className,
}: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleClick = () => {
    if (onViewDetails) {
      onViewDetails(product.id);
    } else {
      // Default behavior: navigate to product page
      window.location.href = `/products/${product.slug}`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Card className="group overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors h-full flex flex-col bg-white dark:bg-gray-900">
        {/* Image Section */}
        <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Package className="h-12 w-12 text-gray-400 dark:text-gray-600" />
            </div>
          )}
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleClick}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              Lihat Detail
            </Button>
          </div>

          {/* Status Badge */}
          {!product.is_active && (
            <div className="absolute top-2 left-2 z-10">
              <Badge variant="destructive" className="text-xs">
                Tidak Tersedia
              </Badge>
            </div>
          )}
        </div>

        {/* Content Section */}
        <CardContent className="p-4 flex flex-col flex-1">
          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
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
                className="gap-1"
              >
                <ShoppingCart className="h-4 w-4" />
                Beli
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/**
 * ProductCardCompact Component
 * A more compact version of the product card for lists
 */
export function ProductCardCompact({
  product,
  className,
}: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <div
        className={cn(
          "flex items-center gap-4 p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer bg-white dark:bg-gray-900",
          className
        )}
      >
        {/* Thumbnail */}
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="64px"
              className="object-cover"
              loading="lazy"
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Package className="h-6 w-6 text-gray-400 dark:text-gray-600" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 dark:text-white truncate">
            {product.name}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formatPrice(product.price)}
          </p>
        </div>

        {/* Action */}
        <Button
          size="sm"
          disabled={!product.is_active}
        >
          Beli
        </Button>
      </div>
    </Link>
  );
}

/**
 * ProductCardSkeleton Component
 * Loading skeleton for product cards
 */
export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Image Skeleton */}
      <div className="aspect-video bg-gray-200 dark:bg-gray-800 animate-pulse" />
      
      {/* Content Skeleton */}
      <CardContent className="p-4 flex flex-col flex-1">
        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-3/4 mb-4" />
        <div className="mt-auto pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-24" />
          <div className="h-9 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * ProductDetailSkeleton Component
 * Loading skeleton for product detail page
 */
export function ProductDetailSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Image Skeleton */}
      <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
      
      {/* Content Skeleton */}
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-1/4" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-3/4" />
        </div>
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-32 mt-6" />
        <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-full mt-4" />
      </div>
    </div>
  );
}
