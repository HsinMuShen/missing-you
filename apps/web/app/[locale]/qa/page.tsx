import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { HelpPageShell } from '@/components/help/help-page-shell';
import { ExternalLinksList } from '@/components/help/external-links';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'help' });
  return {
    title: t('qa.metaTitle'),
    description: t('qa.metaDescription'),
  };
}

export default async function QaPage({ params }: Props) {
  await params;
  const t = await getTranslations('help');
  const faq = t.raw('qa.faq') as Array<{ q: string; a: string }>;
  const links = t.raw('qa.links') as Array<{ label: string; href: string }>;

  return (
    <HelpPageShell title={t('qa.title')} backLabel={t('backHome')}>
      <p>{t('qa.intro')}</p>
      {faq.map((item, i) => (
        <div key={i} className="space-y-2">
          <h2>{item.q}</h2>
          <p>{item.a}</p>
        </div>
      ))}
      <ExternalLinksList title={t('qa.linksTitle')} links={links} />
    </HelpPageShell>
  );
}
