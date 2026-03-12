import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Check if Supabase is properly configured
 */
function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return !!(
    url && 
    key && 
    url.startsWith('http') && 
    !url.includes('your_supabase_url')
  );
}

/**
 * Middleware to handle Supabase session management and route protection
 * Updates the session cookie and protects routes based on authentication
 */
export async function updateSession(request: NextRequest) {
  // If Supabase is not configured, use demo mode
  if (!isSupabaseConfigured()) {
    // In demo mode, check for demo auth cookie
    const isDemoAuth = request.cookies.get('demo_admin_auth')?.value === 'true';
    const pathname = request.nextUrl.pathname;

    // Protect admin routes in demo mode
    if (pathname.startsWith('/dashboard/admin')) {
      if (!isDemoAuth) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
      }
    }

    // Protect dashboard routes in demo mode
    if (pathname.startsWith('/dashboard')) {
      if (!isDemoAuth) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
      }
    }

    // Redirect authenticated users away from auth pages
    if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
      if (isDemoAuth) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard/admin';
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get user metadata for role checking
  const userRole = user?.user_metadata?.role as string | undefined;
  const pathname = request.nextUrl.pathname;

  // Protect admin routes - requires both authentication and admin role
  if (pathname.startsWith('/dashboard/admin')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    // Check if user has admin role
    if (userRole !== 'admin') {
      // Return 403 forbidden page
      const url = request.nextUrl.clone();
      url.pathname = '/forbidden';
      return NextResponse.redirect(url);
    }
  }

  // Protect dashboard routes - requires authentication
  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated admin users away from auth pages
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    if (user) {
      const url = request.nextUrl.clone();
      // Redirect admin to admin dashboard, others to regular dashboard
      url.pathname = userRole === 'admin' ? '/dashboard/admin' : '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
