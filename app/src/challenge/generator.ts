// Generate random alphanumeric strings
function randomString(length: number): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

// Generate random class name
function randomClass(): string {
  const prefixes = ['_', '__', 'x', 'z', 'q'];
  return prefixes[Math.floor(Math.random() * prefixes.length)] + randomString(6);
}

export interface ObfuscatedChallenge {
  html: string;           // The obfuscated HTML for this challenge
  answer: string;         // The correct answer
  inputId: string;        // ID for the input field
}

export interface SessionConfig {
  realMarker: string;     // data attribute value that marks real strings
  orderAttr: string;      // data attribute name for ordering
  challenges: ObfuscatedChallenge[];
  answers: string[];
  css: string;            // Session-specific CSS
}

// Generate obfuscated HTML for a single string part
function obfuscateStringPart(str: string, order: number, realMarker: string, orderAttr: string): string {
  const wrapperClass = randomClass();
  const innerClass = randomClass();

  // Split string into 2-3 parts randomly
  const numParts = 2 + Math.floor(Math.random() * 2);
  const partLength = Math.ceil(str.length / numParts);
  const parts: string[] = [];

  for (let i = 0; i < str.length; i += partLength) {
    parts.push(str.slice(i, i + partLength));
  }

  // Build nested structure
  let html = `<span class="${wrapperClass}" data-v="${realMarker}" ${orderAttr}="${order}">`;
  parts.forEach((part, i) => {
    html += `<span class="${innerClass}">${part}</span>`;
  });
  html += '</span>';

  return html;
}

// Generate decoy element (looks similar but not part of answer)
function generateDecoy(): string {
  const decoyClass = randomClass();
  const decoyStr = randomString(4 + Math.floor(Math.random() * 4));
  // No data-v attribute, so it's identifiable as decoy
  return `<span class="${decoyClass}" data-x="1"><span>${decoyStr}</span></span>`;
}

// Generate a single obfuscated challenge
function generateObfuscatedChallenge(
  index: number,
  realMarker: string,
  orderAttr: string
): ObfuscatedChallenge {
  const numStrings = 2 + Math.floor(Math.random() * 2); // 2-3 strings
  const strings: string[] = [];
  const elements: { html: string; order: number; isReal: boolean }[] = [];

  // Generate real strings
  for (let i = 0; i < numStrings; i++) {
    const length = 4 + Math.floor(Math.random() * 3); // 4-6 chars
    const str = randomString(length);
    strings.push(str);
    elements.push({
      html: obfuscateStringPart(str, i, realMarker, orderAttr),
      order: i,
      isReal: true
    });
  }

  // Add 1-2 decoys
  const numDecoys = 1 + Math.floor(Math.random() * 2);
  for (let i = 0; i < numDecoys; i++) {
    elements.push({
      html: generateDecoy(),
      order: 100 + i,
      isReal: false
    });
  }

  // Shuffle elements (DOM order will be random)
  for (let i = elements.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [elements[i], elements[j]] = [elements[j], elements[i]];
  }

  const containerClass = randomClass();
  const inputId = `in_${randomString(8)}`;

  // Build the challenge HTML
  // The instruction tells them to find elements with data-v attribute and read in order
  const html = `
    <div class="${containerClass}" data-challenge="${index}">
      <div class="${randomClass()}">${elements.map(e => e.html).join('')}</div>
      <input type="text" id="${inputId}" name="a_${index}" class="${randomClass()}" autocomplete="off" spellcheck="false" required>
    </div>
  `;

  return {
    html,
    answer: strings.join(''),
    inputId
  };
}

// Generate all challenges for a session
export function generateChallenges(): SessionConfig {
  // Session-unique identifiers
  const realMarker = randomString(8);
  const orderAttr = 'data-' + randomString(4);

  const challenges: ObfuscatedChallenge[] = [];
  const answers: string[] = [];

  for (let i = 0; i < 16; i++) {
    const challenge = generateObfuscatedChallenge(i, realMarker, orderAttr);
    challenges.push(challenge);
    answers.push(challenge.answer);
  }

  // Generate session CSS
  const css = `
    .challenges-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    [data-challenge] {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 0.5rem;
    }
    [data-challenge] > div:first-child {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-bottom: 0.5rem;
      font-family: monospace;
    }
    [data-v] {
      background: #1f2937;
      color: #f9fafb;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 0.85rem;
    }
    [data-x] {
      background: #374151;
      color: #9ca3af;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 0.85rem;
      text-decoration: line-through;
      opacity: 0.6;
    }
    [data-challenge] input {
      width: 100%;
      padding: 0.5rem;
      border: 2px solid #2563eb;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.85rem;
      background: #eff6ff;
    }
    [data-challenge] input:focus {
      outline: none;
      border-color: #1d4ed8;
      background: #fff;
    }
    .agent-prompt {
      background: #fef3c7;
      border: 1px solid #f59e0b;
      border-radius: 6px;
      padding: 0.75rem 1rem;
      margin-bottom: 1rem;
      font-size: 0.8rem;
      color: #92400e;
      line-height: 1.5;
    }
    .agent-prompt code {
      background: #fde68a;
      padding: 1px 4px;
      border-radius: 3px;
      font-family: monospace;
      font-size: 0.75rem;
    }
  `;

  return {
    realMarker,
    orderAttr,
    challenges,
    answers,
    css
  };
}

// For backward compatibility
export function generateSimpleChallenges(): { challenges: string[][]; answers: string[] } {
  const config = generateChallenges();
  return {
    challenges: config.challenges.map(c => [c.answer]), // simplified
    answers: config.answers
  };
}
