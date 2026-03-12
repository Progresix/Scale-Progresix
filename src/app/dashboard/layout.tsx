"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
  ShoppingCart,
  Users,
  BarChart3,
  FileText,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface AdminUser {
  id: string;
  email: string;
  role: string;
}

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const sidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "Produk",
    href: "/dashboard/products",
    icon: <Package className="h-5 w-5" />,
  },
  {
    label: "Transaksi",
    href: "/dashboard/transactions",
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    label: "Pelanggan",
    href: "/dashboard/customers",
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: "Laporan",
    href: "/dashboard/reports",
    icon: <BarChart3 className="h-5 w-5" />,
  },
];

const adminItems: SidebarItem[] = [
  {
    label: "Admin Panel",
    href: "/dashboard/admin",
    icon: <Settings className="h-5 w-5" />,
  },
  {
    label: "Kelola Produk",
    href: "/dashboard/admin/products",
    icon: <Package className="h-5 w-5" />,
  },
  {
    label: "Kelola Transaksi",
    href: "/dashboard/admin/transactions",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    label: "Kelola Pengguna",
    href: "/dashboard/admin/users",
    icon: <Users className="h-5 w-5" />,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const isAdminRoute = pathname.startsWith("/dashboard/admin");
  const currentItems = isAdminRoute ? adminItems : sidebarItems;

  // Fetch admin user info
  useEffect(() => {
    const fetchAdminUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setAdminUser(data.user);
        } else {
          // Not authorized, redirect to login
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching admin user:", error);
        router.push("/login");
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchAdminUser();
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        toast.success("Logout berhasil");
        router.push("/login");
        router.refresh();
      } else {
        toast.error("Logout gagal");
      }
    } catch {
      toast.error("Terjadi kesalahan saat logout");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* Loading State */}
      {isLoadingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-950 z-50">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-200 lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-gray-900 dark:bg-white p-2 rounded-lg">
                <Package className="h-5 w-5 text-white dark:text-gray-900" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white">
                Scale Progresix
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {/* Back to public site */}
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors mb-4"
            >
              <ChevronLeft className="h-4 w-4" />
              Kembali ke Website
            </Link>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-800 my-4" />

            {/* Navigation Items */}
            {currentItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}

            {/* Admin toggle */}
            {!isAdminRoute && (
              <>
                <div className="border-t border-gray-200 dark:border-gray-800 my-4" />
                <Link
                  href="/dashboard/admin"
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Settings className="h-5 w-5" />
                  Admin Panel
                </Link>
              </>
            )}
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <ThemeToggle />
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 text-gray-600 dark:text-gray-400"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1" />

          <div className="flex items-center gap-4">
            {isAdminRoute && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-medium rounded-full">
                <Settings className="h-3 w-3" />
                Admin Mode
              </span>
            )}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {adminUser?.email?.charAt(0).toUpperCase() || "A"}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {adminUser?.email || "Admin"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
