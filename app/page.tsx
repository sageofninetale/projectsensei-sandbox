'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient'; // <- keep relative import to avoid path-alias issues

export default function Dashboard() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load current session on mount
  useEffect(() => {
    let alive = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      if (!data.session) {
        router.replace('/login');
      } else {
        setEmail(data.session.user.email ?? null);
      }
      setLoading(false);
    });

    // Keep UI in sync if auth state changes
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (!session) {
        router.replace('/login');
      } else {
        setEmail(session.user.email ?? null);
      }
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, [router]);

  // Sign out handler
  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace('/login');
  }

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <p style={{ opacity: 0.7 }}>Loading…</p>
      </main>
    );
  }

  return (
    <main style={{ padding: '48px', maxWidth: 960, margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>ProjectSensei</h1>
        <button
          onClick={handleSignOut}
          style={{
            background: '#e33',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '10px 14px',
            cursor: 'pointer',
          }}
        >
          Sign out
        </button>
      </header>

      <section style={{ marginTop: 28 }}>
        <p style={{ opacity: 0.8 }}>
          Signed in as <strong>{email}</strong>
        </p>
        <p>Welcome back 👋 — your dashboard is ready.</p>
      </section>
    </main>
  );
}
