"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Users, 
  ShoppingCart, 
  Package, 
  DollarSign,
  Settings,
  BarChart3,
  Plus,
  MoreHorizontal,
  ArrowUpRight,
  Loader2,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Transaction } from "@/types/database";

interface DashboardStats {
  totalProducts: number;
  totalTransactions: number;
  totalRevenue: number;
  recentTransactions: Transaction[];
  revenueByMonth: {
    month: string;
    revenue: number;
    transactions: number;
  }[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatCompactNumber = (num: number): string => {
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)}M`;
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}Jt`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}Rb`;
  }
  return num.toString();
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "success":
      return (
        <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20">
          Sukses
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/20">
          Pending
        </Badge>
      );
    case "failed":
      return (
        <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20">
          Gagal
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats");
        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Gagal memuat statistik");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const adminStats = stats ? [
    {
      title: "Total Produk",
      value: stats.totalProducts.toString(),
      icon: Package,
      change: "+5%",
      positive: true,
    },
    {
      title: "Total Transaksi",
      value: stats.totalTransactions.toLocaleString("id-ID"),
      icon: ShoppingCart,
      change: "+12%",
      positive: true,
    },
    {
      title: "Total Pendapatan",
      value: `Rp ${formatCompactNumber(stats.totalRevenue)}`,
      icon: DollarSign,
      change: "+23%",
      positive: true,
    },
    {
      title: "Rata-rata Transaksi",
      value: stats.totalTransactions > 0 
        ? formatCurrency(stats.totalRevenue / stats.totalTransactions)
        : "Rp 0",
      icon: Users,
      change: "+8%",
      positive: true,
    },
  ] : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Kelola toko produk digital Anda</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Pengaturan
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Produk
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((stat, index) => (
          <Card key={index} className="border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <p className={`text-xs flex items-center gap-1 ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                {stat.positive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {stat.change} dari bulan lalu
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      {stats?.revenueByMonth && stats.revenueByMonth.length > 0 && (
        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Pendapatan Bulanan</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Grafik pendapatan 12 bulan terakhir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stats.revenueByMonth}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis 
                    dataKey="month" 
                    className="text-xs fill-gray-500 dark:fill-gray-400"
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis 
                    className="text-xs fill-gray-500 dark:fill-gray-400"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(value) => formatCompactNumber(value)}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    labelStyle={{ color: '#111827', fontWeight: 600 }}
                    formatter={(value: number) => [formatCurrency(value), 'Pendapatan']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
              <Package className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900 dark:text-white">Kelola Produk</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">Tambah, edit, atau hapus produk</CardDescription>
            </div>
          </CardHeader>
        </Card>
        <Card className="border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900 dark:text-white">Kelola Transaksi</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">Lihat dan proses pesanan</CardDescription>
            </div>
          </CardHeader>
        </Card>
        <Card className="border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900 dark:text-white">Laporan</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">Lihat statistik dan laporan</CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Transactions Table */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-900 dark:text-white">Transaksi Terbaru</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">Daftar transaksi dari pelanggan</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Lihat Semua
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {stats?.recentTransactions && stats.recentTransactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-800">
                  <TableHead className="text-gray-600 dark:text-gray-400">Produk</TableHead>
                  <TableHead className="hidden md:table-cell text-gray-600 dark:text-gray-400">Pelanggan</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">Status</TableHead>
                  <TableHead className="hidden sm:table-cell text-gray-600 dark:text-gray-400">Jumlah</TableHead>
                  <TableHead className="hidden lg:table-cell text-gray-600 dark:text-gray-400">Tanggal</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentTransactions.map((tx) => (
                  <TableRow key={tx.id} className="border-gray-200 dark:border-gray-800">
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{tx.product_name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{tx.id}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div>
                        <p className="text-gray-900 dark:text-white">{tx.guest_name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{tx.guest_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(tx.status)}</TableCell>
                    <TableCell className="hidden sm:table-cell font-medium text-gray-900 dark:text-white">
                      {formatCurrency(tx.amount)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-gray-500 dark:text-gray-400">
                      {formatDate(tx.created_at)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                          <DropdownMenuItem>Kirim Ulang</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 dark:text-red-400">
                            Batalkan
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Belum ada transaksi</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
