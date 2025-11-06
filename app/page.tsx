// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

type Session = {
  user: { email?: string | null } | null;
} | null;

export default function HomePage() {
  const router = useRouter();
  const [session, setSession] = useState<Session>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;
      setSession(data.session ? { user: data.session.user } : null);
      setLoading(false);
    }

    // initial load
    init();

    // keep session in sync (login / logout)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, _session) => {
      setSession(_session ? { user: _session.user } : null);
    });

    return () => {
      isMounted = false;
      sub.subscription?.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    // optional: take them to /login after logout
    router.push('/login');
  }

  if (loading) {
    return (
      <main className="ps-wrap">
        <div className="ps-card">Loading…</div>
      </main>
    );
  }

  // Not authenticated → gentle sign-in prompt
  if (!session?.user) {
    return (
      <main className="ps-wrap">
        <div className="ps-card">
          <h1 className="ps-title">Please sign in</h1>
          <p className="ps-muted">You’re not authenticated.</p>
          <p><Link href="/login" className="ps-link">Go to Login</Link></p>
        </div>
      </main>
    );
  }

  // Authenticated → simple dashboard
  return (
    <main className="ps-wrap">
      <header className="ps-header">
        <div className="ps-brand">
          <span className="ps-logo">&lt;/&gt;</span> ProjectSensei
        </div>
        <button onClick={handleSignOut} className="ps-btn">Sign out</button>
      </header>

      <section className="ps-grid">
        <div className="ps-card">
          <h2 className="ps-h2">Welcome back</h2>
          <p className="ps-muted">
            Signed in as <strong>{session.user?.email ?? 'unknown'}</strong>
          </p>
          <p className="ps-help">
            This is your protected home. You can add tiles, stats, or navigation here.
          </p>
        </div>
      </section>
    </main>
  );
}
