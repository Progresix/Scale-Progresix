import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { getDashboardStats } from "@/lib/statistics";

export async function GET() {
  try {
    // Check if user is admin
    const admin = await getAdminUser();
    
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const stats = await getDashboardStats();
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
