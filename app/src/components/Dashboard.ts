import type { Site } from '../db/sqlite.ts';
import { isAuthEnabled } from '../middleware/auth.ts';

const copyIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
</svg>`;

const editIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
</svg>`;

export function DashboardPage(sites: Site[], baseUrl: string) {
  const showLogout = isAuthEnabled();

  const siteCards = sites.map(site => `
    <div class="site-card">
      <div class="site-card-header">
        <h3 class="site-name">${escapeHtml(site.name)}</h3>
        <form method="POST" action="/dashboard/sites/${site.id}/delete" style="margin: 0;">
          <button type="submit" class="btn btn-danger btn-sm">Delete</button>
        </form>
      </div>

      <div class="site-field">
        <label>Challenge URL</label>
        <div class="site-field-value">
          <code>${baseUrl}/c/${site.challenge_slug}</code>
          <button type="button" class="btn-copy" data-copy="${baseUrl}/c/${site.challenge_slug}" title="Copy">${copyIcon}</button>
        </div>
      </div>

      <div class="site-field">
        <label>Callback URL</label>
        <div class="site-field-value" id="callback-display-${site.id}">
          <code>${escapeHtml(site.callback_url)}</code>
          <button type="button" class="btn-copy" data-copy="${escapeHtml(site.callback_url)}" title="Copy">${copyIcon}</button>
          <button type="button" class="btn-edit" onclick="showEditForm('${site.id}')" title="Edit">${editIcon}</button>
        </div>
        <form method="POST" action="/dashboard/sites/${site.id}/update" id="callback-edit-${site.id}" class="edit-form" style="display: none;">
          <input type="url" name="callback_url" value="${escapeHtml(site.callback_url)}" required>
          <button type="submit" class="btn btn-primary btn-sm">Save</button>
          <button type="button" class="btn btn-sm" onclick="hideEditForm('${site.id}')">Cancel</button>
        </form>
      </div>

      <div class="site-field">
        <label>Secret</label>
        <div class="site-field-value">
          <code class="secret">${site.secret.substring(0, 16)}...</code>
          <button type="button" class="btn-copy" data-copy="${site.secret}" title="Copy full secret">${copyIcon}</button>
        </div>
      </div>
    </div>
  `).join('');

  return `
    <header class="dashboard-header">
      <div class="dashboard-header-left">
        <h1>Agent-CAPTCHA Dashboard</h1>
        <p class="subtitle">Manage your verification sites</p>
      </div>
      ${showLogout ? `
        <form method="POST" action="/logout" style="margin: 0;">
          <button type="submit" class="btn-ghost">Logout</button>
        </form>
      ` : ''}
    </header>

    <section class="card">
      <h2>Register New Site</h2>
      <form method="POST" action="/dashboard/sites" class="form-inline">
        <div class="form-group">
          <label for="name">Site Name</label>
          <input type="text" id="name" name="name" placeholder="My App" required>
        </div>
        <div class="form-group">
          <label for="callback_url">Callback URL</label>
          <input type="url" id="callback_url" name="callback_url" placeholder="https://myapp.com/verify-callback" required>
        </div>
        <button type="submit" class="btn btn-primary">Register Site</button>
      </form>
    </section>

    <section class="card">
      <h2>Registered Sites</h2>
      ${sites.length === 0 ? '<p class="empty">No sites registered yet.</p>' : `
        <div class="site-cards">
          ${siteCards}
        </div>
      `}
    </section>

    <section class="card">
      <h2>Integration Guide</h2>
      <p style="margin-bottom: 1rem; color: var(--text-muted);">Tokens are JWTs (HS256) signed with your secret. Verify them server-side using standard JWT libraries.</p>
      <div class="code-block">
        <pre><code>// 1. Redirect agent to challenge URL
window.location.href = '${baseUrl}/c/YOUR_SLUG';

// 2. Agent returns with JWT token
// https://yoursite.com/callback?token=eyJhbG...

// 3. Verify the JWT with your secret
const crypto = require('crypto');

function verifyAgentToken(token, secret) {
  const [header, payload, sig] = token.split('.');
  const expected = crypto.createHmac('sha256', secret)
    .update(header + '.' + payload).digest('base64url');
  if (sig !== expected) return null; // Invalid signature
  const data = JSON.parse(Buffer.from(payload, 'base64url'));
  if (data.exp < Date.now() / 1000) return null; // Expired
  return data; // { siteId, sessionId, completedAt, exp, iat }
}

// Usage
const result = verifyAgentToken(token, 'YOUR_SECRET');
if (result) {
  console.log('Verified! Session:', result.sessionId);
}
</code></pre>
      </div>
    </section>

    <script>
      document.querySelectorAll('.btn-copy').forEach(btn => {
        btn.addEventListener('click', async () => {
          const text = btn.getAttribute('data-copy');
          try {
            await navigator.clipboard.writeText(text);
            btn.classList.add('copied');
            setTimeout(() => btn.classList.remove('copied'), 1500);
          } catch (err) {
            console.error('Failed to copy:', err);
          }
        });
      });

      function showEditForm(id) {
        document.getElementById('callback-display-' + id).style.display = 'none';
        document.getElementById('callback-edit-' + id).style.display = 'flex';
      }

      function hideEditForm(id) {
        document.getElementById('callback-display-' + id).style.display = 'flex';
        document.getElementById('callback-edit-' + id).style.display = 'none';
      }
    </script>
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
