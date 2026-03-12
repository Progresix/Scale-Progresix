import { createClient, isSupabaseConfigured, createAdminClient } from "@/lib/supabase/server";
import type { Transaction } from "@/types/database";

export interface DashboardStats {
  totalProducts: number;
  totalTransactions: number;
  totalRevenue: number;
  recentTransactions: Transaction[];
  revenueByMonth: RevenueData[];
}

export interface RevenueData {
  month: string;
  revenue: number;
  transactions: number;
}

// Mock data for development/demo when Supabase is not configured
const mockRecentTransactions: Transaction[] = [
  {
    id: "TRX-001",
    product_id: "1",
    product_name: "Website Template Pro",
    amount: 299000,
    status: "success",
    guest_name: "John Doe",
    guest_email: "john@example.com",
    payment_method: "bank_transfer",
    midtrans_order_id: "ORD-001",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "TRX-002",
    product_id: "2",
    product_name: "E-Book Marketing",
    amount: 99000,
    status: "pending",
    guest_name: "Jane Smith",
    guest_email: "jane@example.com",
    payment_method: "gopay",
    midtrans_order_id: "ORD-002",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "TRX-003",
    product_id: "3",
    product_name: "UI Kit Premium",
    amount: 199000,
    status: "success",
    guest_name: "Bob Wilson",
    guest_email: "bob@example.com",
    payment_method: "bank_transfer",
    midtrans_order_id: "ORD-003",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "TRX-004",
    product_id: "4",
    product_name: "Icon Pack",
    amount: 149000,
    status: "failed",
    guest_name: "Alice Brown",
    guest_email: "alice@example.com",
    payment_method: "credit_card",
    midtrans_order_id: "ORD-004",
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "TRX-005",
    product_id: "1",
    product_name: "WordPress Theme",
    amount: 249000,
    status: "success",
    guest_name: "Charlie Davis",
    guest_email: "charlie@example.com",
    payment_method: "bank_transfer",
    midtrans_order_id: "ORD-005",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * Generate mock revenue data for the last 12 months
 */
function generateMockRevenueData(): RevenueData[] {
  const data: RevenueData[] = [];
  const now = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
    const baseRevenue = Math.floor(Math.random() * 15000000) + 5000000;
    const transactionCount = Math.floor(Math.random() * 50) + 10;
    
    data.push({
      month: monthName,
      revenue: baseRevenue,
      transactions: transactionCount,
    });
  }
  
  return data;
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  // If Supabase is not configured, return mock data
  if (!isSupabaseConfigured()) {
    return {
      totalProducts: 4,
      totalTransactions: 156,
      totalRevenue: 45600000,
      recentTransactions: mockRecentTransactions,
      revenueByMonth: generateMockRevenueData(),
    };
  }

  try {
    const supabase = createAdminClient();
    
    // Get total products count
    const { count: totalProducts, error: productsError } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);
    
    if (productsError) {
      console.error("Error fetching products count:", productsError);
    }
    
    // Get total transactions count
    const { count: totalTransactions, error: transactionsError } = await supabase
      .from("transactions")
      .select("*", { count: "exact", head: true });
    
    if (transactionsError) {
      console.error("Error fetching transactions count:", transactionsError);
    }
    
    // Get total revenue (sum of successful transactions)
    const { data: revenueData, error: revenueError } = await supabase
      .from("transactions")
      .select("amount")
      .eq("status", "success");
    
    if (revenueError) {
      console.error("Error fetching revenue:", revenueError);
    }
    
    const totalRevenue = revenueData?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
    
    // Get recent 5 transactions
    const { data: recentTransactions, error: recentError } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);
    
    if (recentError) {
      console.error("Error fetching recent transactions:", recentError);
    }
    
    // Get revenue by month for the last 12 months
    const revenueByMonth = await getRevenueByMonth(supabase);
    
    return {
      totalProducts: totalProducts || 0,
      totalTransactions: totalTransactions || 0,
      totalRevenue,
      recentTransactions: recentTransactions || [],
      revenueByMonth,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalProducts: 0,
      totalTransactions: 0,
      totalRevenue: 0,
      recentTransactions: [],
      revenueByMonth: [],
    };
  }
}

/**
 * Get revenue grouped by month for the last 12 months
 */
async function getRevenueByMonth(supabase: ReturnType<typeof createAdminClient>): Promise<RevenueData[]> {
  const data: RevenueData[] = [];
  const now = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
    
    const monthName = startDate.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
    
    try {
      const { data: transactions, error } = await supabase
        .from("transactions")
        .select("amount")
        .eq("status", "success")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString());
      
      if (error) {
        console.error(`Error fetching transactions for ${monthName}:`, error);
        data.push({
          month: monthName,
          revenue: 0,
          transactions: 0,
        });
        continue;
      }
      
      const revenue = transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
      
      data.push({
        month: monthName,
        revenue,
        transactions: transactions?.length || 0,
      });
    } catch {
      data.push({
        month: monthName,
        revenue: 0,
        transactions: 0,
      });
    }
  }
  
  return data;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format large numbers with abbreviations
 */
export function formatCompactNumber(num: number): string {
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
}
