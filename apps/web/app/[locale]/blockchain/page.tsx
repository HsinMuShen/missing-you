import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { HelpPageShell } from '@/components/help/help-page-shell';
import { ExternalLinksList } from '@/components/help/external-links';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'help' });
  return {
    title: t('blockchain.metaTitle'),
    description: t('blockchain.metaDescription'),
  };
}

export default async function BlockchainPage({ params }: Props) {
  await params;
  const t = await getTranslations('help');
  const links = t.raw('blockchain.links') as Array<{ label: string; href: string }>;

  return (
    <HelpPageShell title={t('blockchain.title')} backLabel={t('backHome')}>
      <p>{t('blockchain.lead')}</p>
      <h2>{t('blockchain.s1Title')}</h2>
      <p>{t('blockchain.s1Body')}</p>
      <h2>{t('blockchain.s2Title')}</h2>
      <p>{t('blockchain.s2Body')}</p>
      <h2>{t('blockchain.s3Title')}</h2>
      <p>{t('blockchain.s3Body')}</p>
      <ExternalLinksList title={t('blockchain.linksTitle')} links={links} />
    </HelpPageShell>
  );
}
