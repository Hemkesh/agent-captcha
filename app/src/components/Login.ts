export function LoginPage(error?: string) {
  return `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="login-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h1>Agent-CAPTCHA</h1>
          <p class="subtitle">Admin Dashboard Login</p>
        </div>

        ${error ? `<div class="alert alert-error">${escapeHtml(error)}</div>` : ''}

        <form method="POST" action="/login" class="login-form">
          <div class="form-group">
            <label for="password">Admin Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter admin password"
              required
              autofocus
            >
          </div>
          <button type="submit" class="btn btn-primary btn-large btn-full">
            Login
          </button>
        </form>

        <p class="login-hint">
          Password is set via the <code>ADMIN_PASSWORD</code> environment variable.
        </p>
      </div>
    </div>
  `;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
