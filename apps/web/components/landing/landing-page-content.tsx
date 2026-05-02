'use client';

import { useTranslations } from 'next-intl';
import { Button, Container } from '@missing-you/ui';
import { Link } from '@/lib/i18n/navigation';
import { ScrollReveal } from '@/components/landing/scroll-reveal';

export function LandingPageContent() {
  const t = useTranslations('home');

  const values = [
    { key: 'private', icon: '🔒' },
    { key: 'proof', icon: '🧾' },
    { key: 'share', icon: '🤍' },
  ] as const;

  const flow = ['write', 'save', 'anchor', 'share', 'verify'] as const;
  const faq = ['onChain', 'stored', 'private'] as const;

  return (
    <div className="overflow-hidden">
      <section className="relative border-b border-border/60 py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,hsl(var(--accent)/.5),transparent_42%),radial-gradient(circle_at_80%_15%,hsl(var(--muted)/.6),transparent_35%)]" />
        <Container className="relative max-w-4xl text-center">
          <ScrollReveal>
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {t('eyebrow')}
            </p>
            <h1 className="font-display text-4xl font-medium leading-tight text-foreground sm:text-6xl">
              {t('headline')}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {t('subhead')}
            </p>
          </ScrollReveal>

          <ScrollReveal delayMs={120}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="shadow-soft">
                <Link href="/write">{t('cta.write')}</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/memories">{t('cta.memories')}</Link>
              </Button>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={220}>
            <div className="mt-14 grid gap-3 sm:grid-cols-3">
              {values.map((item) => (
                <div key={item.key} className="rounded-xl border border-border bg-card/80 p-5 text-left shadow-soft">
                  <p className="text-xl">{item.icon}</p>
                  <p className="mt-2 text-sm font-medium text-foreground">{t(`value.cards.${item.key}.title`)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t(`value.cards.${item.key}.body`)}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="max-w-4xl">
          <ScrollReveal>
            <h2 className="font-display text-3xl font-medium text-foreground">{t('flow.title')}</h2>
            <p className="mt-3 text-muted-foreground">{t('flow.body')}</p>
          </ScrollReveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-5">
            {flow.map((step, index) => (
              <ScrollReveal key={step} delayMs={index * 70}>
                <div className="group rounded-xl border border-border bg-card p-4 shadow-soft transition-transform duration-300 hover:-translate-y-1">
                  <p className="text-xs font-mono text-muted-foreground">0{index + 1}</p>
                  <p className="mt-2 text-sm font-medium text-foreground">{t(`flow.steps.${step}.title`)}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {t(`flow.steps.${step}.body`)}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 bg-muted/40 py-16 sm:py-24">
        <Container className="max-w-4xl">
          <div className="grid items-center gap-10 sm:grid-cols-2">
            <ScrollReveal>
              <h2 className="font-display text-3xl font-medium text-foreground">{t('journey.title')}</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{t('journey.body')}</p>
              <ul className="mt-6 space-y-3">
                <li className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground">
                  {t('journey.points.one')}
                </li>
                <li className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground">
                  {t('journey.points.two')}
                </li>
                <li className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground">
                  {t('journey.points.three')}
                </li>
              </ul>
            </ScrollReveal>

            <ScrollReveal delayMs={140}>
              <div className="relative h-72 rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="floating-card absolute left-5 top-6 w-48 rounded-lg border border-border bg-background/90 p-4">
                  <p className="text-xs text-muted-foreground">{t('journey.card.draftLabel')}</p>
                  <p className="mt-2 text-sm text-foreground">{t('journey.card.draftBody')}</p>
                </div>
                <div className="floating-card-delayed absolute right-5 top-28 w-48 rounded-lg border border-border bg-background/90 p-4">
                  <p className="text-xs text-muted-foreground">{t('journey.card.proofLabel')}</p>
                  <p className="mt-2 text-sm text-foreground">{t('journey.card.proofBody')}</p>
                </div>
                <div className="floating-card-slow absolute bottom-6 left-14 w-52 rounded-lg border border-border bg-background/90 p-4">
                  <p className="text-xs text-muted-foreground">{t('journey.card.shareLabel')}</p>
                  <p className="mt-2 text-sm text-foreground">{t('journey.card.shareBody')}</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="max-w-4xl">
          <ScrollReveal>
            <h2 className="font-display text-3xl font-medium text-foreground">{t('faq.title')}</h2>
          </ScrollReveal>
          <div className="mt-8 space-y-3">
            {faq.map((item, idx) => (
              <ScrollReveal key={item} delayMs={idx * 80}>
                <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
                  <p className="text-sm font-medium text-foreground">{t(`faq.items.${item}.q`)}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{t(`faq.items.${item}.a`)}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 bg-muted/40 py-16 sm:py-20">
        <Container className="max-w-3xl text-center">
          <ScrollReveal>
            <h2 className="font-display text-3xl font-medium text-foreground">{t('publicMemories.title')}</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{t('publicMemories.body')}</p>
            <div className="mt-7">
              <Button asChild size="lg" variant="secondary">
                <Link href="/public-memories">{t('publicMemories.cta')}</Link>
              </Button>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      <section className="border-t border-border/60 bg-accent/20 py-16">
        <Container className="max-w-3xl text-center">
          <ScrollReveal>
            <h2 className="font-display text-3xl font-medium text-foreground">{t('finalCta.title')}</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{t('finalCta.body')}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/write">{t('finalCta.primary')}</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/memories">{t('finalCta.secondary')}</Link>
              </Button>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </div>
  );
}
