import { Hono } from 'hono';

const api = new Hono();

// Health check
api.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: Date.now() });
});

export default api;
