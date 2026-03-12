import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export interface AdminUser {
  id: string;
  email: string;
  role: string;
}

/**
 * Get the current admin user from the session
 * Returns null if not authenticated or not an admin
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  // If Supabase is not configured, check for demo mode
  if (!isSupabaseConfigured()) {
    // In demo mode, return a mock admin user
    return {
      id: "demo-admin",
      email: "admin@demo.com",
      role: "admin",
    };
  }

  try {
    const supabase = await createClient();
    
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const role = user.user_metadata?.role as string;
    
    if (role !== "admin") {
      return null;
    }

    return {
      id: user.id,
      email: user.email || "",
      role: role,
    };
  } catch (error) {
    console.error("Error getting admin user:", error);
    return null;
  }
}

/**
 * Require admin user - redirects to login if not authenticated or not admin
 * Use this in server components for protected routes
 */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdminUser();
  
  if (!admin) {
    redirect("/login");
  }
  
  return admin;
}

/**
 * Check if the current session has admin privileges
 */
export async function isAdmin(): Promise<boolean> {
  const admin = await getAdminUser();
  return admin !== null;
}
