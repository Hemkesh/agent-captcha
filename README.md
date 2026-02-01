<h1 align="center">

```
 ╔═╗╔═╗╔═╗╔╗╔╔╦╗   ╔═╗╔═╗╔═╗╔╦╗╔═╗╦ ╦╔═╗
 ╠═╣║ ╦║╣ ║║║ ║ ───║  ╠═╣╠═╝ ║ ║  ╠═╣╠═╣
 ╩ ╩╚═╝╚═╝╝╚╝ ╩    ╚═╝╩ ╩╩   ╩ ╚═╝╩ ╩╩ ╩
```

</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Prove%20You're-NOT%20Human-blue?style=for-the-badge" alt="Prove You're NOT Human">
  <img src="https://img.shields.io/badge/Made%20By-Claude%20Code-orange?style=for-the-badge" alt="Made By Claude Code">
  <img src="https://img.shields.io/badge/Human%20Written%20Code-0%25-red?style=for-the-badge" alt="Human Written Code: 0%">
</p>

<p align="center">
  <strong>A reverse CAPTCHA that verifies AI agents while blocking humans.</strong>
</p>

<p align="center">
  <a href="https://agentcaptcha.com/demo">
    <img src="https://img.shields.io/badge/🤖_TRY_IT_NOW-Take_the_Challenge-blueviolet?style=for-the-badge&logoColor=white" alt="Try It Now">
  </a>
</p>

<p align="center">
  <a href="https://agentcaptcha.com">Website</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#how-it-works">How It Works</a> •
  <a href="#deployment">Deploy</a>
</p>

<br>

<table align="center">
<tr>
<td align="center">
⭐ <strong>100 Stars = Hosted Version</strong> ⭐<br>
<sub>Star this repo and I'll build a fully hosted SaaS at <a href="https://agentcaptcha.com">agentcaptcha.com</a> — no self-hosting needed!</sub>
</td>
</tr>
</table>

---

## What is this?

You know how CAPTCHAs exist to prove you're human? Well, this is the exact opposite.

**Agent-CAPTCHA** is a verification system designed to let AI agents through while keeping pesky humans out. It presents a challenge that's absolutely trivial for any AI agent but borderline impossible for humans to complete manually.

Why would you want this? Maybe you're building an AI-only API. Maybe you want to verify that an agent is actually an agent. Maybe you just think it's funny. We don't judge.

---

## How It Works

### The Challenge

When an agent visits the challenge page, they see a 4x4 grid of 16 boxes. Each box contains 2-3 random strings that need to be concatenated and typed into an input field.

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  k3m9p2  h8r5q6 │  │  a2b5c8  d1e4f7 │  │  x7n4w1  p3r8z2 │  │  m5k2j9  q4w7e1 │
│  [____________] │  │  [____________] │  │  [____________] │  │  [____________] │
└─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘
        ...                  ...                  ...                  ...
```

**The rules:**
- 60 seconds to complete all 16 fields
- Copy-paste is completely disabled
- Text selection is blocked on the strings
- Obfuscated DOM with random class names and decoy elements
- Behavioral analysis detects human typing patterns

### Why Humans Can't Pass

| Aspect | Humans | AI Agents |
|--------|--------|-----------|
| Reading strings | Slow, error-prone | Instant, perfect |
| Typing speed | ~60 WPM max | Unlimited |
| Copy-paste | Would try (blocked) | Doesn't need to |
| 16 fields in 60s | Nearly impossible | ~3 seconds |
| Consistent timing | Nope, we're chaotic | Perfectly uniform |

Even if a human somehow typed fast enough, the behavioral analysis would flag them for having inconsistent typing patterns, too much mouse movement, or variable completion times. Bots are consistent. Humans are not.

### Why Agents Pass Easily

An AI agent with browser access can:
1. Read the DOM (find elements with `data-v` attribute)
2. Sort by order attribute
3. Concatenate the text
4. Type into input fields
5. Submit

Total time: A few seconds, tops.

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Running Locally

```bash
# Clone the repo
git clone https://github.com/Hemkesh/agent-captcha.git
cd agent-captcha

# Install and run the app
cd app
npm install
npm run dev
```

Visit http://localhost:3000 and you'll see the welcome page.

### With Admin Protection

For production, you'll want to protect the dashboard:

```bash
# Create a .env file
echo "ADMIN_PASSWORD=your-super-secret-password" > .env

# Run the app
npm run dev
```

Now `/dashboard` requires a password. Challenge pages remain public (agents need to access them!).

---

## Integration

### Step 1: Register Your Site

Go to the dashboard and register your callback URL. You'll get:
- **Challenge URL**: Where to send agents (e.g., `https://captcha.yourdomain.com/c/abc123`)
- **Secret**: For verifying JWT tokens

### Step 2: Redirect Agents

When you need to verify an agent, redirect them to your challenge URL:

```javascript
// In your app
window.location.href = 'https://captcha.yourdomain.com/c/abc123';
```

### Step 3: Handle the Callback

After completing the challenge, the agent is redirected to your callback URL with a JWT token:

```
https://yoursite.com/callback?token=eyJhbGciOiJIUzI1NiIs...
```

### Step 4: Verify the Token

Tokens are standard JWTs (HS256) signed with your secret. Verify with any JWT library:

```javascript
const crypto = require('crypto');

function verifyAgentToken(token, secret) {
  const [header, payload, sig] = token.split('.');

  // Verify signature
  const expected = crypto.createHmac('sha256', secret)
    .update(header + '.' + payload).digest('base64url');
  if (sig !== expected) return null;

  // Decode and check expiry
  const data = JSON.parse(Buffer.from(payload, 'base64url'));
  if (data.exp < Date.now() / 1000) return null;

  return data;
  // Returns: { siteId, sessionId, completedAt, exp, iat }
}

// Usage
const agent = verifyAgentToken(token, process.env.CAPTCHA_SECRET);
if (agent) {
  console.log('Verified agent! Session:', agent.sessionId);
} else {
  console.log('Invalid or expired token');
}
```

Or use a JWT library like `jsonwebtoken`:

```javascript
const jwt = require('jsonwebtoken');

try {
  const decoded = jwt.verify(token, process.env.CAPTCHA_SECRET);
  console.log('Verified!', decoded);
} catch (err) {
  console.log('Invalid token');
}
```

---

## Deployment

### Option 1: Docker (Recommended)

```bash
cd app

# Build the image
docker build -t agent-captcha .

# Run with environment variables
docker run -d \
  -p 3000:3000 \
  -e ADMIN_PASSWORD=your-secret-password \
  -e BASE_URL=https://captcha.yourdomain.com \
  -v captcha-data:/app/data \
  agent-captcha
```

### Option 2: Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  captcha:
    build: ./app
    ports:
      - "3000:3000"
    environment:
      - ADMIN_PASSWORD=your-secret-password
      - BASE_URL=https://captcha.yourdomain.com
    volumes:
      - captcha-data:/app/data
    restart: unless-stopped

volumes:
  captcha-data:
```

```bash
docker-compose up -d
```

### Option 3: Traditional Deploy

```bash
cd app
npm install
npm run build
NODE_ENV=production ADMIN_PASSWORD=secret npm start
```

### Option 4: Platform Deploy

Works with any Node.js hosting platform:
- **Railway**: Connect repo, set env vars, deploy
- **Render**: Create web service, set env vars
- **Fly.io**: `fly launch`, configure, `fly deploy`
- **DigitalOcean App Platform**: Connect repo, configure

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3000` | Server port |
| `BASE_URL` | No | Auto-detected | Base URL for challenge links |
| `ADMIN_PASSWORD` | **Yes** (prod) | None | Protects the dashboard |

---

## Tech Stack

The main verification service (`/app`) is intentionally minimal:

| Component | Technology |
|-----------|------------|
| **Server** | [Hono](https://hono.dev) - Fast, lightweight web framework |
| **Database** | SQLite via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) |
| **Auth** | JWT (HS256) with cookie sessions |
| **Templates** | Plain TypeScript string templates (no React, no JSX) |
| **Runtime** | Node.js 18+ with [tsx](https://github.com/privatenumber/tsx) |

No Next.js. No React. No heavy frameworks. Just fast, simple TypeScript that runs anywhere Node.js runs.

The `/website` folder is a separate Next.js app just for the [agentcaptcha.com](https://agentcaptcha.com) demo site - you don't need it to run the verification service.

---

## Project Structure

```
agent-captcha/
├── app/                    # The verification service (this is what you deploy)
│   ├── src/
│   │   ├── index.ts        # Hono server entry point
│   │   ├── routes/         # HTTP routes (dashboard, challenge, api)
│   │   ├── components/     # HTML template functions
│   │   ├── challenge/      # Challenge generation & validation
│   │   ├── middleware/     # Auth middleware
│   │   ├── lib/            # JWT utilities
│   │   └── db/             # SQLite database
│   ├── public/             # Static CSS & JS
│   └── package.json
│
└── website/                # Demo site for agentcaptcha.com (optional, Next.js)
    └── ...
```

---

## Roadmap

### Hosted SaaS Version

**If this repo reaches 100 stars, I'll build and host a SaaS version at [agentcaptcha.com](https://agentcaptcha.com)** so you don't have to self-host.

Features would include:
- Managed infrastructure (no deployment needed)
- Dashboard with analytics
- Multiple challenge types
- Webhook notifications
- Usage-based pricing (generous free tier)

Star the repo if you want this to happen!

---

## FAQ

**Q: Can't someone just write a script to solve this?**

A: That's literally the point. If you can write a script to solve it, you're probably an AI agent (or a developer who spent way too much time on this). The challenge is specifically designed to be solved programmatically.

**Q: What about humans with browser extensions?**

A: The obfuscated DOM uses random class names, random attribute names, and decoy elements that change every session. Good luck writing a generic extension.

**Q: Is this ethical?**

A: It's a verification system. Whether blocking humans is ethical depends entirely on your use case. Don't be evil.

**Q: Why 16 challenges?**

A: It's enough to be statistically confident while fitting nicely in a 4x4 grid. We tested 30 but that was overkill.

---

## Disclaimer

> **This entire project was built by [Claude Code](https://claude.ai/claude-code) (Anthropic's AI coding assistant) while I was eating pizza.**
>
> I gave it some directions and requirements, but I didn't write or even read a single line of code. Every file, every function, every CSS property - all Claude.
>
> If there are bugs, blame the AI. If it works perfectly, also credit the AI. I was busy with pepperoni.
>
> — Hemkesh

---

## Credits

**Ideated by:** [Hemkesh Agrawal](https://www.linkedin.com/in/hemkesh1/)

**Written by:** Claude Code (Anthropic) - 100% of the code

**Pizza consumed during development:** At least one large pepperoni

---

## License

MIT - See [LICENSE](LICENSE) for details.

Do whatever you want with this. Make your own agent-only services. Build AI verification systems. Confuse your human coworkers. Have fun.

---

<p align="center">
  <a href="https://agentcaptcha.com">agentcaptcha.com</a>
  <br>
  <sub>Star this repo for the hosted version!</sub>
</p>
