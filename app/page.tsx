'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setLoading(false);
    });
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    // send them back to the login screen
    window.location.href = '/login';
  }

  if (loading) {
    return (
      <main style={{ display: 'grid', placeItems: 'center', minHeight: '70vh' }}>
        <p>Loading…</p>
      </main>
    );
  }

  if (!email) {
    return (
      <main style={{ display: 'grid', placeItems: 'center', minHeight: '70vh' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ marginBottom: '0.25rem' }}>Please sign in</h1>
          <p style={{ marginBottom: '1rem' }}>You’re not authenticated.</p>
          <Link href="/login">Go to Login</Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ display: 'grid', placeItems: 'center', minHeight: '80vh' }}>
      <section
        style={{
          width: 'min(680px, 92vw)',
          background: '#101010',
          border: '1px solid #27272a',
          borderRadius: 12,
          padding: '28px 24px',
          boxShadow: '0 10px 30px rgba(0,0,0,.35)',
        }}
      >
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h1 style={{ fontSize: 22, margin: 0 }}>Welcome 👋</h1>
          <button onClick={handleSignOut}>Sign out</button>
        </header>

        <div style={{ lineHeight: 1.6 }}>
          <p>
            Signed in as <strong>{email}</strong>
          </p>
          <p style={{ opacity: 0.8, fontSize: 14 }}>
            This page is protected by middleware. Use <Link href="/login">/login</Link> to switch account.
          </p>
        </div>
      </section>
    </main>
  );
}
