"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import type { Product } from "@/types/database";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/admin/products/${productId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await response.json();
        setProduct(data.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Gagal memuat data produk");
        router.push("/dashboard/admin/products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, router]);

  const handleSubmit = async (formData: FormData): Promise<{ success: boolean; error?: string; data?: Product }> => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Update local product data
        setProduct(result.data);
        return { success: true, data: result.data };
      }

      return { success: false, error: result.error || "Terjadi kesalahan" };
    } catch (error) {
      console.error("Error updating product:", error);
      return { success: false, error: "Terjadi kesalahan jaringan" };
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete product");
      }

      toast.success("Produk berhasil dihapus");
      router.push("/dashboard/admin/products");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error instanceof Error ? error.message : "Gagal menghapus produk");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Produk tidak ditemukan</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/dashboard/admin/products")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Daftar Produk
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Produk
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Perbarui informasi produk {product.name}
          </p>
        </div>
        <Button
          variant="destructive"
          onClick={() => setDeleteDialog(true)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Hapus Produk
        </Button>
      </div>

      {/* Product Form */}
      <ProductForm
        initialData={product}
        onSubmit={handleSubmit}
        isEditing={true}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Produk</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus produk{" "}
              <strong>{product.name}</strong>? Tindakan ini tidak dapat
              dibatalkan dan semua file terkait akan dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
