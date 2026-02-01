import { Context, Next } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { createHmac, randomBytes } from 'crypto';

const SESSION_COOKIE = 'admin_session';
const SESSION_MAX_AGE = 24 * 60 * 60; // 24 hours in seconds

// Generate a session token
function generateSessionToken(password: string): string {
  const timestamp = Date.now().toString();
  const random = randomBytes(16).toString('hex');
  const data = `${timestamp}:${random}`;
  const sig = createHmac('sha256', password).update(data).digest('hex');
  return `${data}:${sig}`;
}

// Verify a session token
function verifySessionToken(token: string, password: string): boolean {
  const parts = token.split(':');
  if (parts.length !== 3) return false;

  const [timestamp, random, sig] = parts;
  const data = `${timestamp}:${random}`;
  const expected = createHmac('sha256', password).update(data).digest('hex');

  if (sig !== expected) return false;

  // Check if expired (24 hours)
  const tokenTime = parseInt(timestamp, 10);
  if (Date.now() - tokenTime > SESSION_MAX_AGE * 1000) return false;

  return true;
}

// Get admin password from environment
export function getAdminPassword(): string | undefined {
  return process.env.ADMIN_PASSWORD;
}

// Check if admin auth is enabled
export function isAuthEnabled(): boolean {
  const password = getAdminPassword();
  return !!password && password.length > 0;
}

// Check if user is authenticated
export function isAuthenticated(c: Context): boolean {
  if (!isAuthEnabled()) return true; // No password set, allow access

  const session = getCookie(c, SESSION_COOKIE);
  if (!session) return false;

  return verifySessionToken(session, getAdminPassword()!);
}

// Login and set session cookie
export function login(c: Context, password: string): boolean {
  const adminPassword = getAdminPassword();
  if (!adminPassword) return true; // No password set

  if (password !== adminPassword) return false;

  const token = generateSessionToken(adminPassword);
  setCookie(c, SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: SESSION_MAX_AGE,
    path: '/'
  });

  return true;
}

// Logout and clear session cookie
export function logout(c: Context): void {
  deleteCookie(c, SESSION_COOKIE, { path: '/' });
}

// Middleware to require authentication
export async function requireAuth(c: Context, next: Next): Promise<Response | void> {
  if (!isAuthenticated(c)) {
    return c.redirect('/login');
  }
  await next();
}
