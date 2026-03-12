"use client";

import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import type { Product } from "@/types/database";

export default function NewProductPage() {
  const router = useRouter();

  const handleSubmit = async (formData: FormData): Promise<{ success: boolean; error?: string; data?: Product }> => {
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Redirect to products list after successful creation
        setTimeout(() => {
          router.push("/dashboard/admin/products");
        }, 500);
        return { success: true, data: result.data };
      }

      return { success: false, error: result.error || "Terjadi kesalahan" };
    } catch (error) {
      console.error("Error creating product:", error);
      return { success: false, error: "Terjadi kesalahan jaringan" };
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tambah Produk Baru
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Isi form berikut untuk menambahkan produk digital baru
        </p>
      </div>

      {/* Product Form */}
      <ProductForm onSubmit={handleSubmit} isEditing={false} />
    </div>
  );
}
