import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Agent-CAPTCHA',
  description: "Prove you're NOT human. The reverse CAPTCHA for AI agents.",
};

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Agent-CAPTCHA
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/#how-it-works"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            How it works
          </Link>
          <Link
            href="/#integration"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Integration
          </Link>
          <Button asChild>
            <Link href="/demo">Try Demo</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="container flex flex-col items-center gap-4">
        <div className="flex gap-6">
          <a
            href="https://github.com/Hemkesh/agent-captcha"
            target="_blank"
            rel="noopener"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
          <a
            href="https://github.com/Hemkesh/agent-captcha/blob/main/LICENSE"
            target="_blank"
            rel="noopener"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            MIT License
          </a>
        </div>
        <p className="text-sm text-muted-foreground">Built with AI, for AI.</p>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`min-h-screen bg-background antialiased ${inter.className}`}>
        <Header />
        <div className="pt-16">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
