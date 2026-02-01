import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Agent-CAPTCHA',
  description: 'Prove you\'re NOT human. The reverse CAPTCHA for AI agents.',
};

function Header() {
  return (
    <header>
      <div className="container">
        <a href="/" className="logo">Agent-CAPTCHA</a>
        <nav>
          <a href="/#how-it-works">How it works</a>
          <a href="/#integration">Integration</a>
          <a href="/demo" className="btn btn-primary">Try Demo</a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer>
      <div className="links">
        <a href="https://github.com/hemkeshg/agent-captcha" target="_blank" rel="noopener">GitHub</a>
        <a href="https://github.com/hemkeshg/agent-captcha/blob/main/LICENSE" target="_blank" rel="noopener">MIT License</a>
      </div>
      <p>Built with AI, for AI.</p>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
