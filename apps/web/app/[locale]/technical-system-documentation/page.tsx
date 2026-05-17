import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { MarkdownDocument } from '@/components/docs/markdown-document';
import { TechnicalDocShell } from '@/components/docs/technical-doc-shell';
import { loadTechnicalSystemDocumentation } from '@/lib/docs/load-technical-system-documentation';

const LIVE_SITE_ORIGIN = 'https://missing-you.hsinmushen.com';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'help' });
  return {
    title: t('technicalSystemDoc.metaTitle'),
    description: t('technicalSystemDoc.metaDescription'),
    robots: { index: false, follow: false },
  };
}

export default async function TechnicalSystemDocumentationPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('help');
  const content = await loadTechnicalSystemDocumentation();
  const liveSiteHref = `${LIVE_SITE_ORIGIN}/${locale}`;

  return (
    <TechnicalDocShell
      backLabel={t('backHome')}
      liveSiteLabel={t('technicalSystemDoc.liveSiteLabel')}
      liveSiteAria={t('technicalSystemDoc.liveSiteAria')}
      liveSiteHref={liveSiteHref}
    >
      <MarkdownDocument content={content} />
    </TechnicalDocShell>
  );
}
