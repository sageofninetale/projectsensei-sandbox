'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

type SimpleUser = {
  email: string | null;
};

export default function DashboardPage() {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1) Initial fetch on mount
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser({ email: user.email ?? null });
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    getUser();

    // 2) Subscribe to auth changes (login / logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ email: session.user.email ?? null });
      } else {
        setUser(null);
      }
    });

    // 3) Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    // Hard redirect to login to avoid stale UI
    window.location.href = '/login';
  };

  // ==============================
  // UI STATES
  // ==============================

  // Loading while we check session
  if (loading) {
    return (
      <div className="ps-page">
        <div className="ps-shell">
          <header className="ps-header">
            <div>
              <div className="ps-logo">&lt;/&gt; ProjectSensei</div>
              <p className="ps-tagline">Build fearlessly — Sensei has you.</p>
            </div>
          </header>

          <main className="ps-main">
            <section className="ps-card">
              <p className="ps-muted">Checking your session…</p>
            </section>
          </main>
        </div>
      </div>
    );
  }

  // Not authenticated → gentle sign-in prompt
  if (!user) {
    return (
      <div className="ps-page">
        <div className="ps-shell">
          <header className="ps-header">
            <div>
              <div className="ps-logo">&lt;/&gt; ProjectSensei</div>
              <p className="ps-tagline">Build fearlessly — Sensei has you.</p>
            </div>
          </header>

          <main className="ps-main">
            <section className="ps-card ps-card-hero">
              <h1 className="ps-title">Please sign in</h1>
              <p className="ps-muted">
                Your session has expired or you&apos;re not authenticated.
              </p>
              <Link href="/login" className="ps-button">
                Go to login
              </Link>
            </section>
          </main>
        </div>
      </div>
    );
  }

  // Authenticated dashboard
  return (
    <div className="ps-page">
      <div className="ps-shell">
        <header className="ps-header">
          <div>
            <div className="ps-logo">&lt;/&gt; ProjectSensei</div>
            <p className="ps-tagline">Build fearlessly — Sensei has you.</p>
          </div>

          <button
            onClick={handleSignOut}
            className="ps-button ps-button-ghost"
          >
            Sign out
          </button>
        </header>

        <main className="ps-main">
          {/* Hero / welcome card */}
          <section className="ps-card ps-card-hero">
            <p className="ps-label">Signed in</p>
            <h1 className="ps-title">
              Welcome back,{' '}
              <span className="ps-accent">{user.email}</span>
            </h1>
            <p className="ps-muted">
              You&apos;re logged in with a secure magic-link session.
              This dashboard is your starting point; we&apos;ll plug in real
              project data in later phases.
            </p>
          </section>

          {/* Three info cards */}
          <section className="ps-grid">
            <div className="ps-card">
              <h2 className="ps-card-title">What&apos;s set up</h2>
              <ul className="ps-list">
                <li>Supabase magic link authentication</li>
                <li>Protected routes via middleware</li>
                <li>Session-aware home dashboard</li>
              </ul>
            </div>

            <div className="ps-card">
              <h2 className="ps-card-title">Next steps</h2>
              <ul className="ps-list">
                <li>Connect this auth shell to your real app UI.</li>
                <li>Add team / project views on top of this layout.</li>
                <li>Introduce role-based access once you need it.</li>
              </ul>
            </div>

            <div className="ps-card">
              <h2 className="ps-card-title">Session status</h2>
              <p className="ps-muted">
                You&apos;re authenticated via Supabase and running on Vercel.
              </p>
              <p className="ps-chip">Magic link active</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
