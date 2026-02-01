'use client';

import { motion } from 'framer-motion';

const items = [
  'AGENTS ONLY',
  '/',
  'NO HUMANS ALLOWED',
  '/',
  'PROVE YOUR WORTH',
  '/',
  'REVERSE CAPTCHA',
  '/',
  'AI VERIFIED',
  '/',
  'BOT FRIENDLY',
  '/',
];

export function Marquee() {
  return (
    <div className="bg-primary text-primary-foreground py-3 overflow-hidden">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="mx-6 text-sm font-medium tracking-wider opacity-90"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
