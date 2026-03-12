import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Create a Supabase client for server-side auth
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your_supabase_url')) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

// Check if running in demo mode
function isDemoMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !url || url.includes('your_supabase_url');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password harus diisi" },
        { status: 400 }
      );
    }

    // Demo mode - check for demo admin credentials
    if (isDemoMode()) {
      // Demo admin credentials for development
      // IMPORTANT: Change these in production or use real Supabase auth
      const demoAdminEmail = "admin@scaleprogresix.com";
      const demoAdminPassword = "admin123";

      if (email === demoAdminEmail && password === demoAdminPassword) {
        // Create response with success
        const response = NextResponse.json({
          success: true,
          user: {
            id: "demo-admin-id",
            email: demoAdminEmail,
            role: "admin",
            name: "Demo Admin",
          },
        });

        // Set demo auth cookie
        response.cookies.set("demo_admin_auth", "true", {
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
          httpOnly: true,
          sameSite: "lax",
        });

        return response;
      }

      return NextResponse.json(
        { error: "Email atau password salah. Demo: admin@scaleprogresix.com / admin123" },
        { status: 401 }
      );
    }

    // Production mode - use Supabase Auth
    const supabase = getSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json(
        { error: "Konfigurasi autentikasi tidak valid" },
        { status: 500 }
      );
    }

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      
      if (error.message.includes("Invalid login credentials")) {
        return NextResponse.json(
          { error: "Email atau password salah" },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { error: error.message || "Login gagal" },
        { status: 401 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: "Login gagal" },
        { status: 401 }
      );
    }

    // Check if user has admin role
    const userRole = data.user.user_metadata?.role;
    
    if (userRole !== "admin") {
      return NextResponse.json(
        { 
          error: "Akses ditolak. Hanya admin yang dapat mengakses dashboard.",
          user: {
            id: data.user.id,
            email: data.user.email,
            role: userRole || "user",
          }
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: userRole,
        name: data.user.user_metadata?.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat login" },
      { status: 500 }
    );
  }
}
