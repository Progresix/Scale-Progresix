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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Loader2,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";
import type { Transaction, Product } from "@/types/database";

type TransactionWithProduct = Transaction & { product_name: string; product?: Product };

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
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    success: {
      bg: "bg-green-500/10",
      text: "text-green-600 dark:text-green-400",
      label: "Sukses",
    },
    pending: {
      bg: "bg-yellow-500/10",
      text: "text-yellow-600 dark:text-yellow-400",
      label: "Pending",
    },
    failed: {
      bg: "bg-red-500/10",
      text: "text-red-600 dark:text-red-400",
      label: "Gagal",
    },
    expired: {
      bg: "bg-gray-500/10",
      text: "text-gray-600 dark:text-gray-400",
      label: "Expired",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge className={`${config.bg} ${config.text} hover:${config.bg}`}>
      {config.label}
    </Badge>
  );
};

const getPaymentTypeLabel = (type: string | null) => {
  if (!type) return "-";
  const types: Record<string, string> = {
    bank_transfer: "Transfer Bank",
    credit_card: "Kartu Kredit",
    gopay: "GoPay",
    ovo: "OVO",
    dana: "DANA",
    shopeepay: "ShopeePay",
    qris: "QRIS",
    cstore: "Convenience Store",
  };
  return types[type] || type;
};

export default function TransactionsListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [transactions, setTransactions] = useState<TransactionWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all");
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1", 10)
  );
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (statusFilter && statusFilter !== "all") params.set("status", statusFilter);
      params.set("page", currentPage.toString());
      params.set("limit", limit.toString());

      const response = await fetch(`/api/admin/transactions?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();
      setTransactions(data.data);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Gagal memuat data transaksi");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter, currentPage]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (statusFilter && statusFilter !== "all") params.set("status", statusFilter);
    if (currentPage > 1) params.set("page", currentPage.toString());
    router.push(`/dashboard/admin/transactions?${params.toString()}`, { scroll: false });
  }, [searchQuery, statusFilter, currentPage, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTransactions();
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // Calculate summary stats
  const successCount = transactions.filter((t) => t.status === "success").length;
  const pendingCount = transactions.filter((t) => t.status === "pending").length;
  const totalRevenue = transactions
    .filter((t) => t.status === "success")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Kelola Transaksi
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Lihat dan kelola semua transaksi
          </p>
        </div>
        <Button variant="outline" onClick={() => fetchTransactions()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-gray-200 dark:border-gray-800">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {total}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Transaksi</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200 dark:border-gray-800">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {successCount}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Transaksi Sukses</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200 dark:border-gray-800">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {pendingCount}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Menunggu Pembayaran</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200 dark:border-gray-800">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pendapatan (halaman ini)</p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Card */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-gray-900 dark:text-white">
                Daftar Transaksi
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                {total} transaksi ditemukan
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[160px] border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="success">Sukses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Gagal</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              {/* Search */}
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Cari email / order ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-[200px] sm:w-[250px] border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  />
                </div>
                <Button type="submit" variant="secondary">
                  Cari
                </Button>
              </form>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchQuery || statusFilter !== "all"
                  ? "Tidak ada transaksi yang cocok dengan filter"
                  : "Belum ada transaksi"}
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                      <TableHead className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        Order ID
                      </TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        Pelanggan
                      </TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-400 whitespace-nowrap hidden md:table-cell">
                        Produk
                      </TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        Jumlah
                      </TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        Status
                      </TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-400 whitespace-nowrap hidden lg:table-cell">
                        Pembayaran
                      </TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-400 whitespace-nowrap hidden lg:table-cell">
                        Tanggal
                      </TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow
                        key={tx.id}
                        className="border-gray-200 dark:border-gray-700"
                      >
                        <TableCell>
                          <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-600 dark:text-gray-400">
                            {tx.midtrans_order_id || tx.id}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {tx.guest_name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {tx.guest_email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-gray-900 dark:text-white">
                            {tx.product_name}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium text-gray-900 dark:text-white whitespace-nowrap">
                          {formatCurrency(tx.amount)}
                        </TableCell>
                        <TableCell>{getStatusBadge(tx.status)}</TableCell>
                        <TableCell className="hidden lg:table-cell text-gray-500 dark:text-gray-400">
                          {getPaymentTypeLabel(tx.payment_type)}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {formatDate(tx.created_at)}
                        </TableCell>
                        <TableCell>
                          <Link href={`/dashboard/admin/transactions/${tx.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
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
                    {Math.min(currentPage * limit, total)} dari {total} transaksi
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
    </div>
  );
}
