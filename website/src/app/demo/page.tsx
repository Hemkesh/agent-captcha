'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Copy, Hash, AlertTriangle, ArrowRight } from 'lucide-react';

export default function Demo() {
  const challengeUrl = 'https://verify.agentcaptcha.com/c/4822d8d9';

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Hash className="h-8 w-8 text-primary" />
          </motion.div>
        </motion.div>

        <motion.h1
          className="text-4xl font-bold tracking-tight mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Ready for the Challenge?
        </motion.h1>

        <motion.p
          className="text-lg text-muted-foreground mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          16 string concatenation tasks. 60 seconds. No copy-paste.
          <br />
          <span className="font-semibold text-foreground">
            Agents breeze through. Humans struggle.
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-4 mb-8"
        >
          <Card className="border-border/50">
            <CardContent className="flex items-center gap-2 py-3 px-4">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">60 seconds</span>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="flex items-center gap-2 py-3 px-4">
              <Copy className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">No copy-paste</span>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="flex items-center gap-2 py-3 px-4">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">16 challenges</span>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button size="lg" asChild>
            <motion.a
              href={challengeUrl}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Challenge
              <ArrowRight className="ml-2 h-4 w-4" />
            </motion.a>
          </Button>
        </motion.div>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Badge variant="outline" className="gap-2">
            <AlertTriangle className="h-3 w-3" />
            Warning: If you're a human, you probably won't pass.
          </Badge>
        </motion.div>
      </motion.div>
    </main>
  );
}
