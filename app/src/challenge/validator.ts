export interface SessionMetrics {
  mouseMovements: number;
  mousePath: [number, number][];
  keystrokes: number;
  keystrokeTiming: number[];
  fieldCompletionTimes: number[];
  totalTime: number;
  pasteAttempts: number;
  copyAttempts: number;
}

// Validate that all answers are correct
export function validateAnswers(submitted: string[], expected: string[]): boolean {
  if (submitted.length !== expected.length) return false;

  for (let i = 0; i < expected.length; i++) {
    if (submitted[i] !== expected[i]) return false;
  }

  return true;
}

// Check if the metrics suggest this is a human (we want to flag humans)
export function isLikelyHuman(metrics: SessionMetrics): { isHuman: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // Too many mouse movements (humans move mouse erratically)
  if (metrics.mouseMovements > 100) {
    reasons.push('Excessive mouse movement detected');
  }

  // High variance in typing speed (humans are inconsistent)
  if (metrics.keystrokeTiming.length > 10) {
    const avg = metrics.keystrokeTiming.reduce((a, b) => a + b, 0) / metrics.keystrokeTiming.length;
    const variance = metrics.keystrokeTiming.reduce((sum, t) => sum + Math.pow(t - avg, 2), 0) / metrics.keystrokeTiming.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev > avg * 0.5) {
      reasons.push('Inconsistent typing speed');
    }
  }

  // High variance in field completion times (humans slow down, speed up)
  if (metrics.fieldCompletionTimes.length > 5) {
    const avg = metrics.fieldCompletionTimes.reduce((a, b) => a + b, 0) / metrics.fieldCompletionTimes.length;
    const variance = metrics.fieldCompletionTimes.reduce((sum, t) => sum + Math.pow(t - avg, 2), 0) / metrics.fieldCompletionTimes.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev > avg * 0.3) {
      reasons.push('Variable field completion timing');
    }
  }

  // Took too long (humans can't do 16 fields in under 30 seconds)
  if (metrics.totalTime > 30000) {
    reasons.push('Completion time too slow');
  }

  // Attempted to paste (only humans would try this)
  if (metrics.pasteAttempts > 0) {
    reasons.push('Paste attempts detected');
  }

  // Attempted to copy (only humans would try this)
  if (metrics.copyAttempts > 0) {
    reasons.push('Copy attempts detected');
  }

  return {
    isHuman: reasons.length >= 2, // Flag if 2+ human indicators
    reasons
  };
}

// Check if this looks like a bot (this is what we want!)
export function isLikelyBot(metrics: SessionMetrics): { isBot: boolean; confidence: number } {
  let botIndicators = 0;

  // Minimal mouse movement (bots don't need to move mouse)
  if (metrics.mouseMovements < 20) botIndicators++;

  // Consistent typing speed (bots type at consistent speed)
  if (metrics.keystrokeTiming.length > 10) {
    const avg = metrics.keystrokeTiming.reduce((a, b) => a + b, 0) / metrics.keystrokeTiming.length;
    const variance = metrics.keystrokeTiming.reduce((sum, t) => sum + Math.pow(t - avg, 2), 0) / metrics.keystrokeTiming.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev < avg * 0.2) botIndicators++;
  }

  // Fast completion (bots can do this in seconds)
  if (metrics.totalTime < 15000) botIndicators++;

  // Consistent field completion times
  if (metrics.fieldCompletionTimes.length > 5) {
    const avg = metrics.fieldCompletionTimes.reduce((a, b) => a + b, 0) / metrics.fieldCompletionTimes.length;
    const variance = metrics.fieldCompletionTimes.reduce((sum, t) => sum + Math.pow(t - avg, 2), 0) / metrics.fieldCompletionTimes.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev < avg * 0.15) botIndicators++;
  }

  // No paste attempts (bots don't need to copy/paste)
  if (metrics.pasteAttempts === 0) botIndicators++;

  return {
    isBot: botIndicators >= 3,
    confidence: (botIndicators / 5) * 100
  };
}
