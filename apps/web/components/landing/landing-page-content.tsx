'use client';

import { useTranslations } from 'next-intl';
import { Button, Container } from '@missing-you/ui';
import { Link } from '@/lib/i18n/navigation';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { actionBtnFullMobile } from '@/lib/ui/mobile-action-layout';

function ValueGlyph({ variant }: { variant: 'private' | 'proof' | 'share' }) {
  const cls = 'h-6 w-6 shrink-0 text-foreground';
  if (variant === 'private') {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
        />
      </svg>
    );
  }
  if (variant === 'proof') {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      </svg>
    );
  }
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  );
}

export function LandingPageContent() {
  const t = useTranslations('home');

  const values = [{ key: 'private' }, { key: 'proof' }, { key: 'share' }] as const;

  const flow = ['write', 'save', 'anchor', 'share', 'verify'] as const;

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
            <div className="mx-auto mt-10 flex w-full max-w-sm flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
              <Button asChild size="lg" className={`shadow-soft ${actionBtnFullMobile}`}>
                <Link href="/write">{t('cta.write')}</Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className={actionBtnFullMobile}>
                <Link href="/memories">{t('cta.memories')}</Link>
              </Button>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={220}>
            <div className="mt-14 grid gap-3 sm:grid-cols-3">
              {values.map((item) => (
                <div key={item.key} className="rounded-xl border border-border bg-card/80 p-5 text-left shadow-soft">
                  <ValueGlyph variant={item.key} />
                  <p className="mt-2 text-sm font-medium text-foreground">{t(`value.cards.${item.key}.title`)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t(`value.cards.${item.key}.body`)}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </Container>
      </section>

      <section className="border-y border-border/60 bg-muted/35 py-16 sm:py-24">
        <Container className="max-w-3xl">
          <ScrollReveal>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {t('blockchainStory.eyebrow')}
            </p>
            <h2 className="mt-4 font-display text-3xl font-medium leading-snug text-foreground sm:text-4xl">
              {t('blockchainStory.title')}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t('blockchainStory.intro')}
            </p>
          </ScrollReveal>

          <div className="mt-12 space-y-6">
            {(['uses', 'what', 'why'] as const).map((key, index) => (
              <ScrollReveal key={key} delayMs={80 + index * 90}>
                <div className="rounded-2xl border border-border bg-card/90 p-6 shadow-soft sm:p-8">
                  <p className="font-mono text-xs text-muted-foreground">0{index + 1}</p>
                  <h3 className="mt-2 font-display text-xl font-medium text-foreground sm:text-2xl">
                    {t(`blockchainStory.${key}Title`)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {t(`blockchainStory.${key}Body`)}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="max-w-5xl">
          <ScrollReveal>
            <h2 className="font-display text-3xl font-medium text-foreground">{t('learn.title')}</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">{t('learn.subtitle')}</p>
          </ScrollReveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(
              [
                { href: '/qa' as const, titleKey: 'learn.qaTitle' as const, descKey: 'learn.qaDesc' as const },
                {
                  href: '/blockchain' as const,
                  titleKey: 'learn.blockchainTitle' as const,
                  descKey: 'learn.blockchainDesc' as const,
                },
                {
                  href: '/wallet-and-anchor' as const,
                  titleKey: 'learn.walletTitle' as const,
                  descKey: 'learn.walletDesc' as const,
                },
                {
                  href: '/how-it-works' as const,
                  titleKey: 'learn.howTitle' as const,
                  descKey: 'learn.howDesc' as const,
                },
              ] as const
            ).map((item, index) => (
              <ScrollReveal key={item.href} delayMs={index * 70}>
                <Link
                  href={item.href}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition-colors hover:border-foreground/25 hover:bg-card"
                >
                  <h3 className="font-display text-lg font-medium text-foreground group-hover:underline group-hover:underline-offset-4">
                    {t(item.titleKey)}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{t(item.descKey)}</p>
                  <p className="mt-4 text-xs font-medium text-foreground/80">→</p>
                </Link>
              </ScrollReveal>
            ))}
          </div>
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

      <section className="border-y border-border/60 bg-muted/40 py-16 sm:py-20">
        <Container className="max-w-3xl text-center">
          <ScrollReveal>
            <h2 className="font-display text-3xl font-medium text-foreground">{t('publicMemories.title')}</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{t('publicMemories.body')}</p>
            <div className="mx-auto mt-7 w-full max-w-sm sm:max-w-none">
              <Button asChild size="lg" variant="secondary" className={actionBtnFullMobile}>
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
            <div className="mx-auto mt-8 flex w-full max-w-sm flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
              <Button asChild size="lg" className={actionBtnFullMobile}>
                <Link href="/write">{t('finalCta.primary')}</Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className={actionBtnFullMobile}>
                <Link href="/memories">{t('finalCta.secondary')}</Link>
              </Button>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </div>
  );
}
