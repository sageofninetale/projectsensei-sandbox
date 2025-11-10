'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.error(error);

  return (
    <html lang="en">
      <body className="ps-page">
        <div className="ps-shell">
          <header className="ps-header">
            <div className="ps-logo">&lt;/&gt; ProjectSensei</div>
          </header>
          <main className="ps-main">
            <div className="ps-card">
              <p className="ps-label">Something went wrong</p>
              <h1 className="ps-title">Sensei hit an unexpected error.</h1>
              <p className="ps-muted">
                It’s probably on us, not you. You can try again, or head back
                to your dashboard.
              </p>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                <button onClick={reset} className="ps-button ps-button-ghost">
                  Try again
                </button>
                <a href="/" className="ps-button">
                  Go to dashboard
                </a>
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
