import Database, { type Database as DatabaseType } from 'better-sqlite3';
import { randomBytes } from 'crypto';
import { existsSync, mkdirSync } from 'fs';
import { createJWT } from '../lib/jwt.ts';
import type { SessionConfig } from '../challenge/generator.ts';

// Use DATA_DIR env var for persistent storage (e.g., Railway volumes)
const dataDir = process.env.DATA_DIR || '.';
if (dataDir !== '.' && !existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}
const dbPath = `${dataDir}/captcha.db`;
const db: DatabaseType = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS sites (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    callback_url TEXT NOT NULL,
    challenge_slug TEXT UNIQUE NOT NULL,
    secret TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    challenges TEXT NOT NULL,
    answers TEXT NOT NULL,
    current_step INTEGER DEFAULT 0,
    metrics TEXT,
    completed INTEGER DEFAULT 0,
    token TEXT,
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    FOREIGN KEY (site_id) REFERENCES sites(id)
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

export interface Site {
  id: string;
  name: string;
  callback_url: string;
  challenge_slug: string;
  secret: string;
  created_at: number;
}

export interface Session {
  id: string;
  site_id: string;
  challenges: string;
  answers: string;
  current_step: number;
  metrics: string | null;
  completed: number;
  token: string | null;
  created_at: number;
  expires_at: number;
}

export function generateId(): string {
  return randomBytes(16).toString('hex');
}

export function generateSlug(): string {
  return randomBytes(4).toString('hex');
}

export function generateSecret(): string {
  return randomBytes(32).toString('hex');
}

export function generateToken(): string {
  return randomBytes(24).toString('hex');
}

// Site operations
export function createSite(name: string, callbackUrl: string): Site {
  const site: Site = {
    id: generateId(),
    name,
    callback_url: callbackUrl,
    challenge_slug: generateSlug(),
    secret: generateSecret(),
    created_at: Date.now()
  };

  const stmt = db.prepare(`
    INSERT INTO sites (id, name, callback_url, challenge_slug, secret, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(site.id, site.name, site.callback_url, site.challenge_slug, site.secret, site.created_at);

  return site;
}

export function getSites(): Site[] {
  return db.prepare('SELECT * FROM sites ORDER BY created_at DESC').all() as Site[];
}

export function getSiteById(id: string): Site | undefined {
  return db.prepare('SELECT * FROM sites WHERE id = ?').get(id) as Site | undefined;
}

export function getSiteBySlug(slug: string): Site | undefined {
  return db.prepare('SELECT * FROM sites WHERE challenge_slug = ?').get(slug) as Site | undefined;
}

export function deleteSite(id: string): boolean {
  const result = db.prepare('DELETE FROM sites WHERE id = ?').run(id);
  return result.changes > 0;
}

// Session operations
export function createSession(siteId: string, config: SessionConfig): Session {
  const session: Session = {
    id: generateId(),
    site_id: siteId,
    challenges: JSON.stringify(config.challenges.map(c => c.html)), // Store HTML for reference
    answers: JSON.stringify(config.answers),
    current_step: 0,
    metrics: null,
    completed: 0,
    token: null,
    created_at: Date.now(),
    expires_at: Date.now() + 5 * 60 * 1000 // 5 minutes
  };

  const stmt = db.prepare(`
    INSERT INTO sessions (id, site_id, challenges, answers, current_step, metrics, completed, token, created_at, expires_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    session.id, session.site_id, session.challenges, session.answers,
    session.current_step, session.metrics, session.completed, session.token,
    session.created_at, session.expires_at
  );

  return session;
}

export function getSession(id: string): Session | undefined {
  return db.prepare('SELECT * FROM sessions WHERE id = ?').get(id) as Session | undefined;
}

export function updateSessionMetrics(id: string, metrics: object): void {
  db.prepare('UPDATE sessions SET metrics = ? WHERE id = ?').run(JSON.stringify(metrics), id);
}

export function completeSession(id: string, siteId: string, siteSecret: string): string {
  const completedAt = Date.now();
  const exp = Math.floor((completedAt + 24 * 60 * 60 * 1000) / 1000); // 24 hour expiry

  const token = createJWT({
    siteId,
    sessionId: id,
    completedAt,
    exp
  }, siteSecret);

  db.prepare('UPDATE sessions SET completed = 1, token = ? WHERE id = ?').run(token, id);
  return token;
}

export function getSessionByToken(token: string): Session | undefined {
  return db.prepare('SELECT * FROM sessions WHERE token = ?').get(token) as Session | undefined;
}

export function getActiveSessions(siteId: string): Session[] {
  return db.prepare(
    'SELECT * FROM sessions WHERE site_id = ? AND completed = 0 AND expires_at > ? ORDER BY created_at DESC'
  ).all(siteId, Date.now()) as Session[];
}

// Settings operations
export function getSetting(key: string): string | undefined {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as { value: string } | undefined;
  return row?.value;
}

export function setSetting(key: string, value: string): void {
  db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, value);
}

export function isSetupComplete(): boolean {
  return getSetting('setup_complete') === 'true';
}

export function markSetupComplete(): void {
  setSetting('setup_complete', 'true');
}

export default db;
