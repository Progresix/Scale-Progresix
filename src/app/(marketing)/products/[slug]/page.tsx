import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";
import { getProductBySlug, getRelatedProducts, getAllProductSlugs } from "@/lib/products";
import { ProductDetail } from "./product-detail";
import { ProductDetailSkeleton } from "@/components/shared/product-card";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Enable ISR - revalidate every hour (3600 seconds)
export const revalidate = 3600;

// Generate static params for all products
export async function generateStaticParams() {
  try {
    const slugs = await getAllProductSlugs();
    return slugs.map((slug) => ({
      slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ 
  params 
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://scaleprogresix.com";
  const productUrl = `${baseUrl}/products/${product.slug}`;
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(product.price);

  return {
    title: product.name,
    description: product.description || `${product.name} - ${formattedPrice}. Produk digital berkualitas di Scale Progresix.`,
    keywords: [product.name, "produk digital", "Scale Progresix", product.slug],
    openGraph: {
      title: product.name,
      description: product.description || `Beli ${product.name} dengan harga ${formattedPrice}`,
      type: "website",
      url: productUrl,
      siteName: "Scale Progresix",
      images: product.image_url 
        ? [
            {
              url: product.image_url,
              width: 1200,
              height: 630,
              alt: product.name,
            },
          ]
        : [],
      locale: "id_ID",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description || `Beli ${product.name} dengan harga ${formattedPrice}`,
    },
    alternates: {
      canonical: productUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch related products
  const relatedProducts = await getRelatedProducts(product.id, 4);

  return (
    <main className="min-h-screen">
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetail product={product} relatedProducts={relatedProducts} />
      </Suspense>
    </main>
  );
}
