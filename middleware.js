import { NextResponse } from 'next/server';

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();

  // Public paths — never block
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/auth/callback') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return res;
  }

  // If env is missing, do NOT crash — just allow
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return res; // fail-open so the site stays up
  }

  try {
    // Lazy import is necessary in Edge + keeps bundle small
    const { createServerClient } = await import('@supabase/auth-helpers-nextjs');

    const supabase = createServerClient(url, key, {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => res.cookies.set(name, value, options),
        remove: (name, options) => res.cookies.delete(name, options)
      }
    });

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const redirect = new URL('/login', req.url);
      redirect.searchParams.set('redirectTo', pathname || '/');
      return NextResponse.redirect(redirect);
    }

    return res;
  } catch (err) {
    // If anything goes wrong in middleware, do NOT 500 — allow request
    return res;
  }
}

export const config = {
  matcher: ['/', '/((?!_next|api|public|favicon.ico).*)']
};
