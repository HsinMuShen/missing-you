import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { HelpPageShell } from '@/components/help/help-page-shell';
import { ExternalLinksList } from '@/components/help/external-links';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'help' });
  return {
    title: t('howItWorks.metaTitle'),
    description: t('howItWorks.metaDescription'),
  };
}

export default async function HowItWorksPage({ params }: Props) {
  await params;
  const t = await getTranslations('help');
  const steps = t.raw('howItWorks.steps') as Array<{ title: string; body: string }>;
  const links = t.raw('howItWorks.links') as Array<{ label: string; href: string }>;

  return (
    <HelpPageShell title={t('howItWorks.title')} backLabel={t('backHome')}>
      <p>{t('howItWorks.lead')}</p>
      <ol>
        {steps.map((step, i) => (
          <li key={i}>
            <p className="font-medium text-foreground">{step.title}</p>
            <p className="mt-2">{step.body}</p>
          </li>
        ))}
      </ol>
      <ExternalLinksList title={t('howItWorks.linksTitle')} links={links} />
    </HelpPageShell>
  );
}
