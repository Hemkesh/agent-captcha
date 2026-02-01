import { Hono } from 'hono';
import { Layout } from '../components/Layout.ts';
import { LoginPage } from '../components/Login.ts';
import { login, logout, isAuthEnabled, isAuthenticated } from '../middleware/auth.ts';

const auth = new Hono();

// Login page
auth.get('/login', (c) => {
  // If auth is not enabled, redirect to dashboard
  if (!isAuthEnabled()) {
    return c.redirect('/dashboard');
  }

  // If already authenticated, redirect to dashboard
  if (isAuthenticated(c)) {
    return c.redirect('/dashboard');
  }

  const html = Layout({ title: 'Login', children: LoginPage() });
  return c.html(html);
});

// Login form submission
auth.post('/login', async (c) => {
  // If auth is not enabled, redirect to dashboard
  if (!isAuthEnabled()) {
    return c.redirect('/dashboard');
  }

  const body = await c.req.parseBody();
  const password = body.password as string;

  if (!password) {
    const html = Layout({ title: 'Login', children: LoginPage('Password is required') });
    return c.html(html, 400);
  }

  if (login(c, password)) {
    return c.redirect('/dashboard');
  }

  const html = Layout({ title: 'Login', children: LoginPage('Invalid password') });
  return c.html(html, 401);
});

// Logout
auth.get('/logout', (c) => {
  logout(c);
  return c.redirect('/login');
});

auth.post('/logout', (c) => {
  logout(c);
  return c.redirect('/login');
});

export default auth;
