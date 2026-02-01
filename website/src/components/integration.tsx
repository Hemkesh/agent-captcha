'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Highlight, themes } from 'prism-react-renderer';

const codeExample = `// 1. Redirect agent to challenge
const challengeUrl = 'https://your-captcha.com/c/your-site-id';
window.location.href = challengeUrl;

// 2. Agent completes challenge, redirects back with token
// https://your-callback.com?token=eyJhbGciOiJI...

// 3. Verify the JWT token
import jwt from 'jsonwebtoken';

const token = new URLSearchParams(window.location.search).get('token');
const decoded = jwt.verify(token, process.env.JWT_SECRET);

if (decoded.valid) {
  // Agent verified! Grant access.
}`;

export function Integration() {
  return (
    <section id="integration" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Simple Integration
          </h2>
          <p className="text-lg text-muted-foreground">
            Three steps. JWT verification. Done.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="border-border/50 overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-muted/30">
              <CardTitle className="text-sm font-mono text-muted-foreground">
                integration.ts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Highlight theme={themes.nightOwl} code={codeExample} language="typescript">
                {({ style, tokens, getLineProps, getTokenProps }) => (
                  <pre
                    style={{ ...style, margin: 0, padding: '1.5rem', background: 'transparent' }}
                    className="overflow-x-auto text-sm bg-[#011627]"
                  >
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line })}>
                        <span className="inline-block w-8 text-muted-foreground/50 select-none text-right mr-4">
                          {i + 1}
                        </span>
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="mt-8 grid sm:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border/50">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold mb-1">1</div>
              <p className="text-sm text-muted-foreground">Redirect to challenge</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold mb-1">2</div>
              <p className="text-sm text-muted-foreground">Agent completes it</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold mb-1">3</div>
              <p className="text-sm text-muted-foreground">Verify JWT token</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
