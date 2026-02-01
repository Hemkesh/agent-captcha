import { Hono } from 'hono';
import { Layout } from '../components/Layout.ts';
import { DashboardPage } from '../components/Dashboard.ts';
import { WelcomePage } from '../components/Welcome.ts';
import { getSites, createSite, deleteSite, updateSiteCallback, isSetupComplete, markSetupComplete } from '../db/sqlite.ts';

const dashboard = new Hono();

// Get base URL from environment or request
function getBaseUrl(c: any): string {
  const proto = c.req.header('x-forwarded-proto') || 'http';
  const host = c.req.header('host') || 'localhost:3000';
  return process.env.BASE_URL || `${proto}://${host}`;
}

// Dashboard home - show welcome on first run, otherwise show dashboard
dashboard.get('/', (c) => {
  const sites = getSites();
  const baseUrl = getBaseUrl(c);

  // Show welcome page only on first run (setup not complete)
  if (!isSetupComplete()) {
    const html = Layout({ title: 'Welcome', children: WelcomePage(baseUrl) });
    return c.html(html);
  }

  const html = Layout({ title: 'Dashboard', children: DashboardPage(sites, baseUrl) });
  return c.html(html);
});

// Skip welcome and go to dashboard
dashboard.post('/skip-welcome', (c) => {
  markSetupComplete();
  return c.redirect('/dashboard');
});

// Create new site
dashboard.post('/sites', async (c) => {
  const body = await c.req.parseBody();
  const name = body.name as string;
  const callbackUrl = body.callback_url as string;

  if (!name || !callbackUrl) {
    return c.text('Missing required fields', 400);
  }

  try {
    new URL(callbackUrl); // Validate URL
  } catch {
    return c.text('Invalid callback URL', 400);
  }

  createSite(name, callbackUrl);

  // Mark setup complete when first site is created
  if (!isSetupComplete()) {
    markSetupComplete();
  }

  return c.redirect('/dashboard');
});

// Delete site
dashboard.post('/sites/:id/delete', (c) => {
  const id = c.req.param('id');
  deleteSite(id);
  return c.redirect('/dashboard');
});

// Update site callback URL
dashboard.post('/sites/:id/update', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.parseBody();
  const callbackUrl = body.callback_url as string;

  if (!callbackUrl) {
    return c.text('Missing callback URL', 400);
  }

  try {
    new URL(callbackUrl); // Validate URL
  } catch {
    return c.text('Invalid callback URL', 400);
  }

  updateSiteCallback(id, callbackUrl);
  return c.redirect('/dashboard');
});

export default dashboard;
