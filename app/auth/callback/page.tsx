export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function CallbackPage() {
  const router = useRouter();
  const params = useSearchParams();
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const redirectTo = params.get('redirectTo') || '/';
      router.replace(session ? redirectTo : '/login?error=no_session');
    })();
  }, [router, params]);

  return <main style={{ minHeight:'100svh', display:'grid', placeItems:'center' }}>Finishing sign-in…</main>;
}
