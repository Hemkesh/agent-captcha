import type { SessionConfig } from '../challenge/generator.ts';

export function ChallengePage(sessionId: string, config: SessionConfig, siteName: string) {
  const challengeHtml = config.challenges.map(c => c.html).join('');

  return `
    <header class="challenge-header">
      <h1>Agent Verification</h1>
      <p class="subtitle">Verifying for: ${escapeHtml(siteName)}</p>
    </header>

    <div class="challenge-meta">
      <div class="progress-container">
        <div class="progress-bar" id="progressBar"></div>
      </div>
      <div class="timer" id="timer">1:00</div>
    </div>

    <div class="instructions">
      <p>Concatenate the valid strings (ignore crossed-out decoys). <span class="warning">60 seconds.</span></p>
    </div>

    <div class="agent-prompt">
      <strong>Agent Instructions:</strong>
      For each box, find elements with <code>data-v="${config.realMarker}"</code>,
      sort by <code>${config.orderAttr}</code> attribute, concatenate text,
      enter in <code>name="a_0"</code> through <code>a_15</code>.
      Ignore <code>data-x</code> decoys.
    </div>

    <form id="challengeForm" method="POST" action="/c/${sessionId}/submit">
      <input type="hidden" name="sessionId" value="${sessionId}">
      <input type="hidden" name="metrics" id="metricsInput">

      <div class="challenges-grid">
        ${challengeHtml}
      </div>

      <button type="submit" class="btn btn-primary btn-large" id="submitBtn">
        Submit Answers
      </button>
    </form>

    <style>${config.css}</style>
    <script src="/challenge.js"></script>
  `;
}

export function ChallengeSuccessPage(callbackUrl: string, token: string) {
  const redirectUrl = `${callbackUrl}${callbackUrl.includes('?') ? '&' : '?'}token=${token}`;

  return `
    <div class="success-page">
      <div class="success-icon">✓</div>
      <h1>Verification Complete</h1>
      <p>Redirecting you back...</p>
      <p class="redirect-url"><code>${escapeHtml(redirectUrl)}</code></p>
    </div>
    <script>
      setTimeout(() => {
        window.location.href = ${JSON.stringify(redirectUrl)};
      }, 1500);
    </script>
  `;
}

export function ChallengeFailurePage(reason: string, challengeSlug?: string) {
  const tryAgainLink = challengeSlug
    ? `/c/${challengeSlug}`
    : 'javascript:location.reload()';

  return `
    <div class="failure-page">
      <div class="failure-icon">✗</div>
      <h1>Verification Failed</h1>
      <p>${escapeHtml(reason)}</p>
      <a href="${tryAgainLink}" class="btn btn-secondary">Try Again</a>
    </div>
  `;
}

export function ChallengeExpiredPage(challengeSlug?: string) {
  const tryAgainLink = challengeSlug
    ? `/c/${challengeSlug}`
    : '/';

  return `
    <div class="failure-page">
      <div class="failure-icon">⏱</div>
      <h1>Session Expired</h1>
      <p>This verification session has expired. Please start a new verification.</p>
      <a href="${tryAgainLink}" class="btn btn-secondary">Try Again</a>
    </div>
  `;
}

export function ChallengeNotFoundPage() {
  return `
    <div class="failure-page">
      <div class="failure-icon">?</div>
      <h1>Not Found</h1>
      <p>This challenge URL doesn't exist. Please check the URL and try again.</p>
    </div>
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
