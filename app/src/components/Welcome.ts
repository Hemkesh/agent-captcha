export function WelcomePage(baseUrl: string) {
  return `
    <div class="welcome-container">
      <header class="welcome-header">
        <h1>Welcome to Agent-CAPTCHA</h1>
        <p class="tagline">Prove you're <em>not</em> human.</p>
      </header>

      <section class="welcome-intro">
        <p>
          Agent-CAPTCHA is a <strong>reverse CAPTCHA</strong> system designed to verify AI agents
          while blocking humans. It uses string concatenation challenges that are trivial for
          bots to solve but nearly impossible for humans without copy-paste.
        </p>
      </section>

      <section class="welcome-steps">
        <h2>Getting Started</h2>

        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3>Register Your Site</h3>
            <p>
              Add your callback URL below. This is where agents will be redirected after
              completing verification, with a JWT token as proof.
            </p>
          </div>
        </div>

        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3>Get Your Challenge URL</h3>
            <p>
              You'll receive a unique challenge URL (e.g., <code>${baseUrl}/c/abc123</code>).
              Redirect your agents to this URL when they need to verify.
            </p>
          </div>
        </div>

        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h3>Verify the Token</h3>
            <p>
              When the agent returns to your callback URL with a token, verify it using
              your secret (either locally or via our API).
            </p>
          </div>
        </div>
      </section>

      <section class="welcome-how">
        <h2>How the Challenge Works</h2>
        <div class="challenge-demo">
          <div class="demo-box">
            <div class="demo-strings">
              <span class="demo-real">k3m9p2</span>
              <span class="demo-decoy">x7n4w1</span>
              <span class="demo-real">h8r5q6</span>
            </div>
            <div class="demo-arrow">→</div>
            <code class="demo-answer">k3m9p2h8r5q6</code>
          </div>
        </div>
        <ul class="feature-list">
          <li><strong>16 challenges</strong> in a 4x4 grid</li>
          <li><strong>60 second</strong> time limit</li>
          <li><strong>Copy-paste disabled</strong> - no shortcuts</li>
          <li><strong>Obfuscated DOM</strong> - random classes, decoys, shuffled order</li>
          <li><strong>Behavioral analysis</strong> - detects human typing patterns</li>
        </ul>
      </section>

      <section class="card welcome-register">
        <h2>Register Your First Site</h2>
        <form method="POST" action="/dashboard/sites" class="form-inline">
          <div class="form-group">
            <label for="name">Site Name</label>
            <input type="text" id="name" name="name" placeholder="My App" required>
          </div>
          <div class="form-group">
            <label for="callback_url">Callback URL</label>
            <input type="url" id="callback_url" name="callback_url" placeholder="https://myapp.com/verify-callback" required>
          </div>
          <button type="submit" class="btn btn-primary btn-large">Get Started</button>
        </form>
      </section>

      <section class="welcome-footer">
        <form method="POST" action="/dashboard/skip-welcome" style="margin-bottom: 1rem;">
          <button type="submit" class="btn btn-secondary">Skip to Dashboard</button>
        </form>
        <p class="muted">
          Need help? Check out the <a href="https://github.com/your-repo/agent-captcha" target="_blank">documentation</a>.
        </p>
      </section>
    </div>
  `;
}
