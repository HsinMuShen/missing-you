import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { HelpPageShell } from '@/components/help/help-page-shell';
import { ExternalLinksList } from '@/components/help/external-links';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'help' });
  return {
    title: t('walletGuide.metaTitle'),
    description: t('walletGuide.metaDescription'),
  };
}

export default async function WalletAndAnchorPage({ params }: Props) {
  await params;
  const t = await getTranslations('help');
  const anchorSteps = t.raw('walletGuide.anchorSteps') as string[];
  const links = t.raw('walletGuide.links') as Array<{ label: string; href: string }>;

  return (
    <HelpPageShell title={t('walletGuide.title')} backLabel={t('backHome')}>
      <p>{t('walletGuide.lead')}</p>
      <h2>{t('walletGuide.s1Title')}</h2>
      <p>{t('walletGuide.s1Body')}</p>
      <h2>{t('walletGuide.s2Title')}</h2>
      <p>{t('walletGuide.s2Body')}</p>
      <h2>{t('walletGuide.s3Title')}</h2>
      <p>{t('walletGuide.s3Body')}</p>
      <h2>{t('walletGuide.s4Title')}</h2>
      <p>{t('walletGuide.s4Body')}</p>
      <h2>{t('walletGuide.s5Title')}</h2>
      <ol>
        {anchorSteps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
      <h2>{t('walletGuide.s6Title')}</h2>
      <p>{t('walletGuide.s6Body')}</p>
      <h2>{t('walletGuide.s7Title')}</h2>
      <p>{t('walletGuide.s7Body')}</p>
      <ExternalLinksList title={t('walletGuide.linksTitle')} links={links} />
    </HelpPageShell>
  );
}
