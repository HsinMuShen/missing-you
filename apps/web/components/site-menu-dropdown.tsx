'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Link } from '@/lib/i18n/navigation';

type Props = {
  menuLabel: string;
  sectionMemoriesLabel: string;
  sectionAccountLabel: string;
  writeLabel: string;
  memoriesLabel: string;
  publicMemoriesLabel: string;
  calendarLabel: string;
  learnHeading: string;
  learnSubmenuHint: string;
  helpQaLabel: string;
  helpBlockchainLabel: string;
  helpHowItWorksLabel: string;
  helpWalletGuideLabel: string;
  helpPrivacySecurityLabel: string;
  settingsLabel: string;
  signInLabel: string;
  email?: string | null;
  authenticatedContent: ReactNode;
  walletContent: ReactNode;
};

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <p className="px-2 pb-1 pt-3 text-[10px] font-medium uppercase tracking-wider text-muted-foreground first:pt-0">
      {children}
    </p>
  );
}

function navLinkClassName() {
  return 'block rounded-md px-2 py-1.5 text-foreground hover:bg-muted';
}

function Chevron({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function SiteMenuDropdown({
  menuLabel,
  sectionMemoriesLabel,
  sectionAccountLabel,
  writeLabel,
  memoriesLabel,
  publicMemoriesLabel,
  calendarLabel,
  learnHeading,
  learnSubmenuHint,
  helpQaLabel,
  helpBlockchainLabel,
  helpHowItWorksLabel,
  helpWalletGuideLabel,
  helpPrivacySecurityLabel,
  settingsLabel,
  signInLabel,
  email,
  authenticatedContent,
  walletContent,
}: Props) {
  const detailsRef = useRef<HTMLDetailsElement | null>(null);

  const closeMenu = () => {
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
  };

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const root = detailsRef.current;
      if (!root?.open) return;
      const target = event.target as Node | null;
      if (!target) return;
      if (!root.contains(target)) {
        root.open = false;
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onEscape);
    };
  }, []);

  return (
    <details ref={detailsRef} className="group relative">
      <summary className="list-none cursor-pointer rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground hover:bg-muted [&::-webkit-details-marker]:hidden">
        {menuLabel}
      </summary>
      {/*
        Wallet row lives outside the scroll region so help-icon tooltips are not clipped by
        overflow-y-auto. Scroll only the nav body; footer stays overflow-visible for popovers.
      */}
      <div className="pointer-events-auto absolute right-0 z-[60] mt-2 flex w-80 max-h-[calc(100vh-5rem)] flex-col rounded-xl border border-border bg-card shadow-soft">
        <div className="menu-dropdown-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain py-3 pl-3 pr-2">
          <div className="text-sm">
            <SectionHeading>{sectionMemoriesLabel}</SectionHeading>
            <div className="space-y-0.5">
              <Link href="/write" onClick={closeMenu} className={navLinkClassName()}>
                {writeLabel}
              </Link>
              <Link href="/memories" onClick={closeMenu} className={navLinkClassName()}>
                {memoriesLabel}
              </Link>
              <Link href="/calendar" onClick={closeMenu} className={navLinkClassName()}>
                {calendarLabel}
              </Link>
              <Link href="/public-memories" onClick={closeMenu} className={navLinkClassName()}>
                {publicMemoriesLabel}
              </Link>
            </div>

            <details className="group/learn mt-2 rounded-lg border border-border/90 bg-muted/25">
              <summary className="flex list-none cursor-pointer select-none items-center justify-between gap-2 rounded-lg px-2 py-2 text-foreground hover:bg-muted/60 [&::-webkit-details-marker]:hidden">
                <span className="flex flex-col items-start gap-0.5">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {learnHeading}
                  </span>
                  <span className="text-xs font-normal text-muted-foreground">{learnSubmenuHint}</span>
                </span>
                <Chevron className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open/learn:rotate-180" />
              </summary>
              <div className="space-y-0.5 border-t border-border/70 px-1 py-1">
                <Link href="/qa" onClick={closeMenu} className={`${navLinkClassName()} pl-3 text-[13px]`}>
                  {helpQaLabel}
                </Link>
                <Link href="/blockchain" onClick={closeMenu} className={`${navLinkClassName()} pl-3 text-[13px]`}>
                  {helpBlockchainLabel}
                </Link>
                <Link href="/wallet-and-anchor" onClick={closeMenu} className={`${navLinkClassName()} pl-3 text-[13px]`}>
                  {helpWalletGuideLabel}
                </Link>
                <Link href="/how-it-works" onClick={closeMenu} className={`${navLinkClassName()} pl-3 text-[13px]`}>
                  {helpHowItWorksLabel}
                </Link>
                <Link href="/privacy-security" onClick={closeMenu} className={`${navLinkClassName()} pl-3 text-[13px]`}>
                  {helpPrivacySecurityLabel}
                </Link>
              </div>
            </details>

            <SectionHeading>{sectionAccountLabel}</SectionHeading>
            <div className="space-y-0.5">
              <Link href="/settings" onClick={closeMenu} className={navLinkClassName()}>
                {settingsLabel}
              </Link>
            </div>
          </div>

          <div className="my-3 h-px bg-border" />

          {email ? (
            <div className="space-y-2">
              <p className="truncate rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-muted-foreground">
                {email}
              </p>
              <div onClick={closeMenu}>{authenticatedContent}</div>
            </div>
          ) : (
            <Link
              href="/sign-in"
              onClick={closeMenu}
              className="block rounded-md border border-border px-2 py-1.5 text-center text-xs text-foreground hover:bg-muted"
            >
              {signInLabel}
            </Link>
          )}
        </div>

        <div className="shrink-0 border-t border-border bg-card px-3 py-2">
          <div onClick={closeMenu}>{walletContent}</div>
        </div>
      </div>
    </details>
  );
}
