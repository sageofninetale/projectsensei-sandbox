import './globals.css';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

export const metadata = {
  title: 'ProjectSensei Dashboard',
  description:
    'Build fearlessly — your secure AI & analytics workspace powered by ProjectSensei.',
  icons: {
    icon: '/favicon.ico', // change later if you add a custom logo
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
