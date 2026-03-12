"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Loader2, Shield } from "lucide-react";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard/admin";
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Login gagal");
      }

      // Check if user is admin
      if (result.user?.role !== "admin") {
        toast.error("Akses ditolak. Hanya admin yang dapat masuk.");
        return;
      }

      toast.success("Login berhasil! Mengalihkan ke dashboard...");
      
      // Redirect to admin dashboard
      router.push(redirect);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login gagal. Periksa email dan password Anda.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-900 dark:text-white">
          Email Admin
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="admin@example.com"
          {...register("email")}
          disabled={isLoading}
          className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-900 dark:text-white">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Masukkan password"
          {...register("password")}
          disabled={isLoading}
          className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>
      <Button 
        type="submit" 
        className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100" 
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Masuk sebagai Admin
      </Button>
    </form>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <Card className="w-full max-w-md border-gray-200 dark:border-gray-800">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gray-900 dark:bg-white p-3 rounded-full">
              <Package className="h-8 w-8 text-white dark:text-gray-900" />
            </div>
          </div>
          <CardTitle className="text-2xl text-gray-900 dark:text-white">
            Admin Login
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Masuk untuk mengakses dashboard admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Admin Notice */}
          <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
              <p className="text-xs text-amber-800 dark:text-amber-200">
                Halaman ini khusus untuk administrator. Hanya akun admin yang dapat mengakses dashboard.
              </p>
            </div>
          </div>

          <Suspense fallback={<LoadingFallback />}>
            <LoginForm />
          </Suspense>
          
          <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            Tidak punya akses admin?{" "}
            <a 
              href="mailto:admin@scaleprogresix.com" 
              className="text-gray-900 dark:text-white hover:underline"
            >
              Hubungi administrator
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
