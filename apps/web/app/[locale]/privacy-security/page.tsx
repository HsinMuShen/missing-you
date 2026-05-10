import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { HelpPageShell } from '@/components/help/help-page-shell';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'help' });
  return {
    title: t('privacySecurity.metaTitle'),
    description: t('privacySecurity.metaDescription'),
  };
}

export default async function PrivacySecurityPage({ params }: Props) {
  await params;
  const t = await getTranslations('help');
  const sections = t.raw('privacySecurity.sections') as Array<{ title: string; body: string }>;

  return (
    <HelpPageShell title={t('privacySecurity.title')} backLabel={t('backHome')}>
      <p className="text-sm leading-relaxed text-muted-foreground">{t('privacySecurity.lead')}</p>
      {Array.isArray(sections)
        ? sections.map((s, i) => (
            <div key={i} className="space-y-2">
              <h2 className="text-base font-medium text-foreground">{s.title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))
        : null}
    </HelpPageShell>
  );
}
