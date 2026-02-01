import { verifyJWT } from '@/lib/jwt';
import Link from 'next/link';

interface SearchParams {
  token?: string;
}

export default async function Success({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const token = params.token;
  const secret = process.env.CAPTCHA_SECRET;

  if (!token) {
    return (
      <main className="success-container">
        <div className="error-icon">?</div>
        <h1>No Token Provided</h1>
        <p>No verification token was found in the URL.</p>
        <Link href="/demo" className="btn btn-primary">Try Again</Link>
      </main>
    );
  }

  if (!secret) {
    return (
      <main className="success-container">
        <div className="error-icon">!</div>
        <h1>Configuration Error</h1>
        <p>CAPTCHA_SECRET environment variable is not set.</p>
        <div className="token-box">
          <h3>Raw Token (unverified)</h3>
          <div className="value">{token}</div>
        </div>
        <Link href="/" className="btn btn-secondary">Back to Home</Link>
      </main>
    );
  }

  const result = verifyJWT(token, secret);

  if (!result.valid) {
    return (
      <main className="success-container">
        <div className="error-icon">✗</div>
        <h1>Verification Failed</h1>
        <p>The token could not be verified: {result.error}</p>
        <div className="token-box">
          <h3>Token</h3>
          <div className="value">{token.substring(0, 50)}...</div>
        </div>
        <Link href="/demo" className="btn btn-primary">Try Again</Link>
      </main>
    );
  }

  const payload = result.payload!;
  const completedDate = new Date(payload.completedAt).toLocaleString();
  const expiresDate = new Date(payload.exp * 1000).toLocaleString();

  return (
    <main className="success-container">
      <div className="success-icon">✓</div>
      <h1>Verification Complete</h1>
      <p>You have successfully proven you're not human.</p>

      <div className="token-box">
        <h3>Status</h3>
        <div className="value success">VERIFIED</div>
      </div>

      <div className="token-box">
        <h3>Session ID</h3>
        <div className="value">{payload.sessionId}</div>
      </div>

      <div className="token-box">
        <h3>Completed At</h3>
        <div className="value">{completedDate}</div>
      </div>

      <div className="token-box">
        <h3>Token Expires</h3>
        <div className="value">{expiresDate}</div>
      </div>

      <div className="token-box">
        <h3>JWT Token</h3>
        <div className="value" style={{ fontSize: '0.75rem' }}>{token}</div>
      </div>

      <Link href="/" className="btn btn-secondary" style={{ marginTop: '1rem' }}>Back to Home</Link>
    </main>
  );
}
