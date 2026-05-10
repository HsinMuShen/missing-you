import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/i18n/navigation';
import { Container } from '@missing-you/ui';
import { LanguageSwitcher } from '@/components/language-switcher';
import { WalletMenu } from '@/components/wallet/wallet-menu';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { SiteMenuDropdown } from '@/components/site-menu-dropdown';
import { APP_NAME } from '@missing-you/shared';
import { auth } from '@/auth';

export async function SiteHeader() {
  const t = await getTranslations('nav');
  const session = await auth();

  return (
    <header className="relative z-50 border-b border-border/80 bg-card/60 backdrop-blur-sm">
      <Container className="flex h-16 items-center justify-between gap-3">
        <Link
          href="/"
          className="shrink-0 font-display text-lg font-medium tracking-tight text-foreground"
        >
          {APP_NAME}
        </Link>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <SiteMenuDropdown
            menuLabel={t('menu')}
            sectionMemoriesLabel={t('sectionMemories')}
            sectionAccountLabel={t('sectionAccount')}
            writeLabel={t('write')}
            memoriesLabel={t('memories')}
            publicMemoriesLabel={t('publicMemories')}
            calendarLabel={t('calendar')}
            learnHeading={t('learnHeading')}
            learnSubmenuHint={t('learnSubmenuHint')}
            helpQaLabel={t('helpQa')}
            helpBlockchainLabel={t('helpBlockchain')}
            helpHowItWorksLabel={t('helpHowItWorks')}
            helpWalletGuideLabel={t('helpWalletGuide')}
            settingsLabel={t('settings')}
            signInLabel={t('signIn')}
            email={session?.user?.id ? session.user.email : null}
            authenticatedContent={
              <SignOutButton label={t('signOut')} className="w-full justify-center" />
            }
            walletContent={<WalletMenu />}
          />
        </div>
      </Container>
    </header>
  );
}
