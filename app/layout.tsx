import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-zinc-900 text-zinc-100">
        <header className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="text-red-500 font-semibold">&lt;/&gt; ProjectSensei</Link>
          <nav className="space-x-4">
            <Link href="/login" className="underline underline-offset-4">Login</Link>
          </nav>
        </header>
        <main className="px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
