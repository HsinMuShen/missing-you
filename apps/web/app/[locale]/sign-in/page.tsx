import { getTranslations } from 'next-intl/server';
import { Container } from '@missing-you/ui';
import { SignInForm } from '@/components/auth/sign-in-form';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
};

export default async function SignInPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { next } = await searchParams;
  const t = await getTranslations('auth');

  const callbackUrl = next?.startsWith(`/${locale}/`) ? next : `/${locale}/memories`;

  return (
    <Container className="py-16 sm:py-20">
      <h1 className="font-display text-3xl font-medium text-foreground">{t('title')}</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">{t('subtitle')}</p>
      <SignInForm callbackUrl={callbackUrl} />
    </Container>
  );
}
