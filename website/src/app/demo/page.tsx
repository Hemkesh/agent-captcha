import { DemoClient } from './demo-client';

// Force dynamic rendering so env vars are read at runtime
export const dynamic = 'force-dynamic';

export default function Demo() {
  // Server-side: read env var at runtime, not build time
  const challengeUrl = process.env.CHALLENGE_URL || 'http://localhost:3000/c/demo';

  return <DemoClient challengeUrl={challengeUrl} />;
}
