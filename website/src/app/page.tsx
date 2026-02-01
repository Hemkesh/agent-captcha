const codeExample = `// 1. Redirect agent to challenge URL
window.location.href = 'https://captcha.yoursite.com/c/abc123';

// 2. Agent completes challenge, returns with JWT
// https://yourapp.com/callback?token=eyJhbGciOiJIUzI1NiIs...

// 3. Verify the JWT with your secret
const crypto = require('crypto');

function verifyAgentToken(token, secret) {
  const [header, payload, sig] = token.split('.');
  const expected = crypto.createHmac('sha256', secret)
    .update(header + '.' + payload).digest('base64url');
  if (sig !== expected) return null;
  const data = JSON.parse(Buffer.from(payload, 'base64url'));
  if (data.exp < Date.now() / 1000) return null;
  return data; // { siteId, sessionId, completedAt, exp, iat }
}`;

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <h1>Prove You're <span>Not Human</span></h1>
          <p className="subtitle">
            The reverse CAPTCHA for the agent era. Verify AI agents while keeping humans out.
          </p>
          <div className="buttons">
            <a href="/demo" className="btn btn-primary btn-large">Try Demo</a>
            <a href="https://github.com/hemkeshg/agent-captcha" className="btn btn-secondary btn-large" target="_blank" rel="noopener">
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <p className="section-subtitle">
            A challenge designed to be trivial for AI agents but impossible for humans.
          </p>

          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>16 String Tasks</h3>
              <p>A 4x4 grid where each task shows random strings to concatenate together.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>60 Second Limit</h3>
              <p>All 16 tasks must be completed within 60 seconds. Copy/paste is disabled.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Agents Pass</h3>
              <p>AI agents can read the DOM and type instantly. Humans can't keep up.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section>
        <div className="container">
          <h2>Why It Works</h2>
          <p className="section-subtitle">
            The math doesn't work for humans.
          </p>

          <div className="comparison">
            <table>
              <thead>
                <tr>
                  <th>Aspect</th>
                  <th>Humans</th>
                  <th>Agents</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Reading strings</td>
                  <td>Slow, error-prone</td>
                  <td>Instant, perfect</td>
                </tr>
                <tr>
                  <td>Typing speed</td>
                  <td>~60 WPM max</td>
                  <td>Unlimited</td>
                </tr>
                <tr>
                  <td>Copy-paste</td>
                  <td>Would try (blocked)</td>
                  <td>Doesn't need to</td>
                </tr>
                <tr>
                  <td>16 fields in 60s</td>
                  <td>Nearly impossible</td>
                  <td>~3 seconds</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Integration */}
      <section id="integration">
        <div className="container">
          <h2>Integration</h2>
          <p className="section-subtitle">
            Tokens are JWTs (HS256) signed with your secret. Verify locally with any JWT library.
          </p>

          <div className="code-section">
            <div className="code-header">
              <span className="code-dot red"></span>
              <span className="code-dot yellow"></span>
              <span className="code-dot green"></span>
            </div>
            <div className="code-block">
              <pre>{codeExample}</pre>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
