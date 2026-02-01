import { Hero } from '@/components/hero';
import { Marquee } from '@/components/marquee';
import { HowItWorks } from '@/components/how-it-works';
import { Comparison } from '@/components/comparison';
import { Integration } from '@/components/integration';
import { CTA } from '@/components/cta';

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <HowItWorks />
      <Comparison />
      <Integration />
      <CTA />
    </main>
  );
}
