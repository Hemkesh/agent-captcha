import 'dotenv/config';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';

import dashboard from './routes/dashboard.ts';
import challenge from './routes/challenge.ts';
import api from './routes/api.ts';
import auth from './routes/auth.ts';
import { requireAuth, isAuthEnabled } from './middleware/auth.ts';

const app = new Hono();

// Serve static files
app.use('/styles.css', serveStatic({ path: './public/styles.css' }));
app.use('/challenge.js', serveStatic({ path: './public/challenge.js' }));

// Auth routes (login/logout) - no auth required
app.route('/', auth);

// Protected routes (dashboard) - require auth if password is set
app.use('/dashboard/*', requireAuth);
app.use('/dashboard', requireAuth);
app.route('/dashboard', dashboard);

// Public routes
app.route('/c', challenge);
app.route('/api', api);

// Root redirect
app.get('/', (c) => c.redirect('/dashboard'));

const port = parseInt(process.env.PORT || '3000');

console.log(`Server starting on http://localhost:${port}`);
if (isAuthEnabled()) {
  console.log('Admin authentication is ENABLED (ADMIN_PASSWORD is set)');
} else {
  console.log('Admin authentication is DISABLED (set ADMIN_PASSWORD to enable)');
}

serve({
  fetch: app.fetch,
  port
});
