"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Package, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight
} from "lucide-react";

// Mock data - replace with actual data from Supabase
const stats = [
  {
    title: "Total Pesanan",
    value: "24",
    icon: ShoppingCart,
    change: "+12%",
    positive: true,
  },
  {
    title: "Produk Dibeli",
    value: "18",
    icon: Package,
    change: "+8%",
    positive: true,
  },
  {
    title: "Total Pengeluaran",
    value: "Rp 2.450.000",
    icon: DollarSign,
    change: "+15%",
    positive: true,
  },
  {
    title: "Tingkat Kepuasan",
    value: "98%",
    icon: TrendingUp,
    change: "+5%",
    positive: true,
  },
];

const recentOrders = [
  {
    id: "TRX-001",
    product: "Website Template Pro",
    customer: "john@example.com",
    amount: 299000,
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "TRX-002",
    product: "E-Book Marketing Digital",
    customer: "jane@example.com",
    amount: 99000,
    status: "pending",
    date: "2024-01-14",
  },
  {
    id: "TRX-003",
    product: "UI Kit Premium",
    customer: "bob@example.com",
    amount: 199000,
    status: "completed",
    date: "2024-01-13",
  },
  {
    id: "TRX-004",
    product: "Icon Pack Essential",
    customer: "alice@example.com",
    amount: 149000,
    status: "expired",
    date: "2024-01-12",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return (
        <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20">
          <CheckCircle className="mr-1 h-3 w-3" /> Selesai
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/20">
          <Clock className="mr-1 h-3 w-3" /> Pending
        </Badge>
      );
    case "expired":
      return (
        <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20">
          <XCircle className="mr-1 h-3 w-3" /> Expired
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Selamat datang kembali!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
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
                <ArrowUpRight className="h-3 w-3" />
                {stat.change} dari bulan lalu
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Transaksi Terbaru</CardTitle>
          <CardDescription>Daftar transaksi terbaru dari pelanggan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {order.product}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {order.id} • {order.customer}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      Rp {order.amount.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{order.date}</p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
