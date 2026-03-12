"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Loader2,
  Package,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import type { Product, PaginatedResponse } from "@/types/database";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function ProductsListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1", 10)
  );
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    product: Product | null;
    isDeleting: boolean;
  }>({
    open: false,
    product: null,
    isDeleting: false,
  });

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      params.set("page", currentPage.toString());
      params.set("limit", limit.toString());

      const response = await fetch(`/api/admin/products?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data: PaginatedResponse<Product> = await response.json();
      setProducts(data.data);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Gagal memuat data produk");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (currentPage > 1) params.set("page", currentPage.toString());
    router.push(`/dashboard/admin/products?${params.toString()}`, { scroll: false });
  }, [searchQuery, currentPage, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const handleDelete = async () => {
    if (!deleteDialog.product) return;

    setDeleteDialog((prev) => ({ ...prev, isDeleting: true }));
    try {
      const response = await fetch(
        `/api/admin/products/${deleteDialog.product.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete product");
      }

      toast.success("Produk berhasil dihapus");
      setDeleteDialog({ open: false, product: null, isDeleting: false });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error instanceof Error ? error.message : "Gagal menghapus produk");
      setDeleteDialog((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Kelola Produk
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tambah, edit, atau hapus produk digital
          </p>
        </div>
        <Link href="/dashboard/admin/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Produk
          </Button>
        </Link>
      </div>

      {/* Products Card */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-gray-900 dark:text-white">
                Daftar Produk
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                {total} produk ditemukan
              </CardDescription>
            </div>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-[200px] sm:w-[300px] border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                />
              </div>
              <Button type="submit" variant="secondary">
                Cari
              </Button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchQuery
                  ? "Tidak ada produk yang cocok dengan pencarian"
                  : "Belum ada produk"}
              </p>
              <Link href="/dashboard/admin/products/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Produk Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                      <TableHead className="text-gray-600 dark:text-gray-400 w-[80px]">
                        Gambar
                      </TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-400">
                        Nama Produk
                      </TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-400 hidden md:table-cell">
                        Slug
                      </TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-400">
                        Harga
                      </TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                        Status
                      </TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                        Dibuat
                      </TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow
                        key={product.id}
                        className="border-gray-200 dark:border-gray-700"
                      >
                        <TableCell>
                          <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                              {product.description || "Tidak ada deskripsi"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-600 dark:text-gray-400">
                            {product.slug}
                          </code>
                        </TableCell>
                        <TableCell className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(product.price)}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge
                            variant={product.is_active ? "default" : "secondary"}
                            className={
                              product.is_active
                                ? "bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20"
                                : "bg-gray-500/10 text-gray-600 dark:text-gray-400"
                            }
                          >
                            {product.is_active ? "Aktif" : "Nonaktif"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-gray-500 dark:text-gray-400">
                          {formatDate(product.created_at)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/products/${product.slug}`}
                                  target="_blank"
                                  className="flex items-center"
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Lihat
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/dashboard/admin/products/${product.id}/edit`}
                                  className="flex items-center"
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 dark:text-red-400"
                                onClick={() =>
                                  setDeleteDialog({ open: true, product, isDeleting: false })
                                }
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Menampilkan {(currentPage - 1) * limit + 1} -{" "}
                    {Math.min(currentPage * limit, total)} dari {total} produk
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Sebelumnya
                    </Button>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Halaman {currentPage} dari {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Selanjutnya
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog((prev) => ({ ...prev, open }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Produk</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus produk{" "}
              <strong>{deleteDialog.product?.name}</strong>? Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteDialog.isDeleting}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteDialog.isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteDialog.isDeleting ? (
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
