export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

export const metadata = { title: 'ProjectSensei', description: 'Build Fearlessly — Sensei Has You' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body style={{ margin: 0 }}>{children}</body></html>;
}
