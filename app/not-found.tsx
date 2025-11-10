import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="ps-page">
      <div className="ps-shell">
        <header className="ps-header">
          <div className="ps-logo">&lt;/&gt; ProjectSensei</div>
        </header>
        <main className="ps-main">
          <div className="ps-card">
            <p className="ps-label">404</p>
            <h1 className="ps-title">Sensei can’t find that page.</h1>
            <p className="ps-muted">
              The path you followed doesn’t exist, or it may have moved.
            </p>
            <div style={{ marginTop: '1.5rem' }}>
              <Link href="/" className="ps-button">
                Back to dashboard
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
