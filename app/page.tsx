'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

type UserInfo = { email: string | null };

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      // 1) get current session
      const { data } = await supabase.auth.getSession();
      const email = data.session?.user?.email ?? null;

      if (!email) {
        // not signed in → go to login
        router.replace('/login');
        return;
      }

      if (mounted) {
        setUser({ email });
        setLoading(false);
      }
    }

    load();

    // 2) react to future auth changes (optional, nice to have)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const email = session?.user?.email ?? null;
      if (!email) {
        router.replace('/login');
      } else {
        setUser({ email });
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [router]);

  async function signOut() {
    await supabase.auth.signOut();
    router.replace('/login');
  }

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <p style={{ color: 'var(--ps-text)' }}>Loading your dashboard…</p>
      </main>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateRows: 'auto 1fr' }}>
      {/* Header */}
      <header
        style={{
          borderBottom: '1px solid var(--ps-line)',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ color: 'var(--ps-brand)', fontWeight: 700 }}>{'</>'}</span>
          <span style={{ fontWeight: 700, color: 'var(--ps-text)' }}>ProjectSensei</span>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ color: 'var(--ps-muted)', fontSize: 14 }}>{user?.email}</span>
          <button onClick={signOut}>Sign out</button>
        </div>
      </header>

      {/* Body */}
      <main style={{ padding: 24 }}>
        <h1 style={{ margin: '0 0 12px', color: 'var(--ps-text)' }}>Welcome 👋</h1>
        <p style={{ color: 'var(--ps-muted)', marginBottom: 24 }}>
          You’re signed in with <strong style={{ color: 'var(--ps-text)' }}>{user?.email}</strong>.
        </p>

        {/* Example cards (placeholders you can replace later) */}
        <section
          style={{
            display: 'grid',
            gap: 16,
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          }}
        >
          <div
            style={{
              background: 'var(--ps-card)',
              border: '1px solid var(--ps-line)',
              borderRadius: 12,
              padding: 16,
            }}
          >
            <h3 style={{ marginTop: 0, color: 'var(--ps-text)' }}>Next steps</h3>
            <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--ps-muted)' }}>
              <li>Replace these cards with your app widgets</li>
              <li>Wire real data (Supabase, APIs, etc.)</li>
              <li>Add settings/profile pages</li>
            </ul>
          </div>

          <div
            style={{
              background: 'var(--ps-card)',
              border: '1px solid var(--ps-line)',
              borderRadius: 12,
              padding: 16,
            }}
          >
            <h3 style={{ marginTop: 0, color: 'var(--ps-text)' }}>Status</h3>
            <p style={{ color: 'var(--ps-muted)' }}>Auth is configured and working 🎉</p>
          </div>
        </section>
      </main>
    </div>
  );
}
