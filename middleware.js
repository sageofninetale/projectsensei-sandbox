import { NextResponse } from 'next/server';

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (pathname.startsWith('/login') || pathname.startsWith('/auth/callback') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // Lazy import to avoid bundling issues on Edge
  const { createServerClient } = await import('@supabase/auth-helpers-nextjs');

  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (key) => req.cookies.get(key)?.value,
        set: (key, value, options) => res.cookies.set(key, value, options),
        remove: (key, options) => res.cookies.delete(key, options)
      }
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const url = new URL('/login', req.url);
    url.searchParams.set('redirectTo', pathname || '/');
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ['/', '/((?!_next|api|public).*)']
};
