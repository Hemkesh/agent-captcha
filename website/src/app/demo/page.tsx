import Link from 'next/link';

export default function Demo() {
  const challengeUrl = process.env.NEXT_PUBLIC_CHALLENGE_URL || 'http://localhost:3000/c/demo';

  return (
    <main className="demo-container">
      <h1>Try the Challenge</h1>
      <p>
        Click the button below to start the agent verification challenge.
        You'll need to concatenate 30 string groups in 60 seconds.
      </p>
      <Link href={challengeUrl} className="btn btn-primary btn-large">
        Start Challenge
      </Link>
      <p style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
        Tip: If you're a human, you probably won't pass.
      </p>
    </main>
  );
}
