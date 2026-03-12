import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logout berhasil",
    });

    // Clear demo auth cookie
    response.cookies.delete("demo_admin_auth");
    
    // In production with Supabase, you would also clear Supabase session cookies
    // The Supabase client handles this on the frontend

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat logout" },
      { status: 500 }
    );
  }
}
