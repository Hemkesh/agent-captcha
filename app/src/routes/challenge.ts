import { Hono } from 'hono';
import { Layout } from '../components/Layout.ts';
import {
  ChallengePage,
  ChallengeSuccessPage,
  ChallengeFailurePage,
  ChallengeExpiredPage,
  ChallengeNotFoundPage
} from '../components/ChallengeForm.ts';
import { generateChallenges } from '../challenge/generator.ts';
import { validateAnswers, isLikelyHuman } from '../challenge/validator.ts';
import {
  getSiteBySlug,
  getSiteById,
  createSession,
  getSession,
  updateSessionMetrics,
  completeSession
} from '../db/sqlite.ts';

const challenge = new Hono();

// Start a challenge - creates a new session
challenge.get('/:slug', (c) => {
  const slug = c.req.param('slug');
  const site = getSiteBySlug(slug);

  if (!site) {
    const html = Layout({ title: 'Not Found', children: ChallengeNotFoundPage() });
    return c.html(html, 404);
  }

  // Generate challenges and create session
  const config = generateChallenges();
  const session = createSession(site.id, config);

  const html = Layout({
    title: 'Challenge',
    children: ChallengePage(session.id, config, site.name),
    wide: true
  });
  return c.html(html);
});

// Submit challenge answers
challenge.post('/:sessionId/submit', async (c) => {
  const sessionId = c.req.param('sessionId');
  const session = getSession(sessionId);

  if (!session) {
    const html = Layout({ title: 'Not Found', children: ChallengeNotFoundPage() });
    return c.html(html, 404);
  }

  // Get site early so we have the slug for error pages
  const site = getSiteById(session.site_id);
  const slug = site?.challenge_slug;

  // Check if session is expired
  if (Date.now() > session.expires_at) {
    const html = Layout({ title: 'Expired', children: ChallengeExpiredPage(slug) });
    return c.html(html, 410);
  }

  // Check if already completed
  if (session.completed) {
    const html = Layout({ title: 'Already Completed', children: ChallengeFailurePage('This session has already been completed.', slug) });
    return c.html(html, 400);
  }

  const body = await c.req.parseBody();

  // Extract answers from form (now a_0 through a_15)
  const submitted: string[] = [];
  for (let i = 0; i < 16; i++) {
    const answer = body[`a_${i}`] as string || '';
    submitted.push(answer);
  }

  // Parse metrics
  let metrics = null;
  try {
    const metricsStr = body.metrics as string;
    if (metricsStr) {
      metrics = JSON.parse(metricsStr);
      updateSessionMetrics(sessionId, metrics);
    }
  } catch {
    // Ignore metrics parsing errors
  }

  // Validate answers
  const expected = JSON.parse(session.answers) as string[];
  const isCorrect = validateAnswers(submitted, expected);

  if (!isCorrect) {
    const html = Layout({
      title: 'Failed',
      children: ChallengeFailurePage('One or more answers were incorrect.', slug)
    });
    return c.html(html, 400);
  }

  // Check if metrics suggest human (we want to flag humans)
  if (metrics) {
    const humanCheck = isLikelyHuman(metrics);
    if (humanCheck.isHuman) {
      const html = Layout({
        title: 'Failed',
        children: ChallengeFailurePage('Verification failed: Human-like behavior detected. This verification is for AI agents only.', slug)
      });
      return c.html(html, 403);
    }
  }

  if (!site) {
    const html = Layout({ title: 'Error', children: ChallengeFailurePage('Site configuration error.') });
    return c.html(html, 500);
  }

  // Success! Complete the session and generate token
  const token = completeSession(sessionId, site.id, site.secret);

  const html = Layout({
    title: 'Success',
    children: ChallengeSuccessPage(site.callback_url, token)
  });
  return c.html(html);
});

export default challenge;
