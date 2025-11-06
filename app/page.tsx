'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function DashboardPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user on mount + subscribe to auth changes
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (mounted) setEmail(data.user?.email ?? null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    init();
    return () => {
      mounted = false;
      sub.subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // if middleware protects "/", this will redirect to /login automatically;
    // otherwise we navigate explicitly:
    window.location.href = '/login';
  };

  // Very defensive: if no user (e.g., middleware not yet redirected), show a link.
  if (!loading && !email) {
    return (
      <div className="ps-shell">
        <div className="ps-card">
          <h1 className="ps-title">Please sign in</h1>
          <p className="ps-muted">You’re not authenticated.</p>
          <Link className="ps-btn" href="/login">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="ps-shell">
      <header className="ps-header">
        <div className="ps-brand">
          <span className="ps-logo">&lt;/&gt;</span>
          <span>ProjectSensei</span>
        </div>

        {email && (
          <div className="ps-user">
            <span className="ps-pill">{email}</span>
            <button className="ps-btn-outline" onClick={handleSignOut}>
              Sign out
            </button>
          </div>
        )}
      </header>

      <main className="ps-main">
        <section className="ps-card ps-card-xl">
          <h1 className="ps-title">Welcome 👋</h1>
          <p className="ps-muted">
            You’re signed in with <strong>{email ?? '...'}</strong>.
          </p>

          <div className="ps-grid">
            <div className="ps-tile">
              <h3>Next step</h3>
              <p>Build the dashboard modules and AI hooks.</p>
            </div>
            <div className="ps-tile">
              <h3>Account</h3>
              <p>Use the button above to sign out safely.</p>
            </div>
            <div className="ps-tile">
              <h3>Docs</h3>
              <p>
                <a className="ps-link" href="https://supabase.com/docs" target="_blank">Supabase</a>{' '}
                · <a className="ps-link" href="https://nextjs.org/docs" target="_blank">Next.js</a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="ps-footer">
        <span>Build Fearlessly — Sensei Has You</span>
      </footer>
    </div>
  );
}
