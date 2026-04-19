import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/i18n/navigation';
import { Button, Container } from '@missing-you/ui';

export default async function HomePage() {
  const t = await getTranslations('home');

  return (
    <div>
      <section className="border-b border-border/60 bg-gradient-to-b from-accent/40 to-background py-20 sm:py-28">
        <Container className="max-w-2xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {t('eyebrow')}
          </p>
          <h1 className="font-display text-4xl font-medium leading-tight text-foreground sm:text-5xl">
            {t('headline')}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {t('subhead')}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="shadow-soft">
              <Link href="/write">{t('cta.write')}</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/memories">{t('cta.memories')}</Link>
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <h2 className="font-display text-2xl font-medium text-foreground">{t('how.title')}</h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-3">
            <li className="rounded-lg border border-border bg-card p-6 shadow-soft">
              <h3 className="font-medium text-foreground">{t('how.step1.title')}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t('how.step1.body')}
              </p>
            </li>
            <li className="rounded-lg border border-border bg-card p-6 shadow-soft">
              <h3 className="font-medium text-foreground">{t('how.step2.title')}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t('how.step2.body')}
              </p>
            </li>
            <li className="rounded-lg border border-border bg-card p-6 shadow-soft">
              <h3 className="font-medium text-foreground">{t('how.step3.title')}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t('how.step3.body')}
              </p>
            </li>
          </ul>
        </Container>
      </section>

      <section className="border-t border-border/60 bg-muted/50 py-16">
        <Container className="max-w-2xl text-center">
          <h2 className="font-display text-2xl font-medium text-foreground">{t('privacy.title')}</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">{t('privacy.body')}</p>
        </Container>
      </section>
    </div>
  );
}
