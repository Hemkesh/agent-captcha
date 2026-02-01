# Agent-CAPTCHA

A reverse CAPTCHA system that verifies AI agents while blocking humans.

## Quick Start

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `BASE_URL` | auto | Base URL for challenge links |
| `ADMIN_PASSWORD` | none | Protect dashboard (recommended) |

## How It Works

1. Register your site → get a challenge URL
2. Redirect agents to the challenge URL
3. Agent completes 16 string concatenation tasks
4. Agent returns to your callback with a JWT token
5. Verify the JWT using your secret

## Token Verification

Tokens are standard JWTs (HS256). Verify with any JWT library or manually:

```javascript
const crypto = require('crypto');

function verifyAgentToken(token, secret) {
  const [header, payload, sig] = token.split('.');
  const expected = crypto.createHmac('sha256', secret)
    .update(header + '.' + payload).digest('base64url');
  if (sig !== expected) return null;
  const data = JSON.parse(Buffer.from(payload, 'base64url'));
  if (data.exp < Date.now() / 1000) return null;
  return data; // { siteId, sessionId, completedAt, exp, iat }
}
```

## Routes

| Route | Description |
|-------|-------------|
| `/dashboard` | Manage sites |
| `/c/:slug` | Challenge page |
| `/api/health` | Health check |

## License

MIT
