'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Link } from '@/lib/i18n/navigation';

type Props = {
  menuLabel: string;
  writeLabel: string;
  memoriesLabel: string;
  publicMemoriesLabel: string;
  calendarLabel: string;
  learnHeading: string;
  helpQaLabel: string;
  helpBlockchainLabel: string;
  helpHowItWorksLabel: string;
  settingsLabel: string;
  signInLabel: string;
  email?: string | null;
  authenticatedContent: ReactNode;
  walletContent: ReactNode;
};

export function SiteMenuDropdown({
  menuLabel,
  writeLabel,
  memoriesLabel,
  publicMemoriesLabel,
  calendarLabel,
  learnHeading,
  helpQaLabel,
  helpBlockchainLabel,
  helpHowItWorksLabel,
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
      <summary className="list-none cursor-pointer rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground hover:bg-muted">
        {menuLabel}
      </summary>
      <div className="pointer-events-auto absolute right-0 z-[60] mt-2 w-72 rounded-xl border border-border bg-card p-3 shadow-soft">
        <div className="space-y-1 text-sm">
          <Link
            href="/write"
            onClick={closeMenu}
            className="block rounded-md px-2 py-1.5 text-foreground hover:bg-muted"
          >
            {writeLabel}
          </Link>
          <Link
            href="/memories"
            onClick={closeMenu}
            className="block rounded-md px-2 py-1.5 text-foreground hover:bg-muted"
          >
            {memoriesLabel}
          </Link>
          <Link
            href="/calendar"
            onClick={closeMenu}
            className="block rounded-md px-2 py-1.5 text-foreground hover:bg-muted"
          >
            {calendarLabel}
          </Link>
          <Link
            href="/public-memories"
            onClick={closeMenu}
            className="block rounded-md px-2 py-1.5 text-foreground hover:bg-muted"
          >
            {publicMemoriesLabel}
          </Link>
          <p className="px-2 pt-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {learnHeading}
          </p>
          <Link
            href="/qa"
            onClick={closeMenu}
            className="block rounded-md px-2 py-1.5 text-foreground hover:bg-muted"
          >
            {helpQaLabel}
          </Link>
          <Link
            href="/blockchain"
            onClick={closeMenu}
            className="block rounded-md px-2 py-1.5 text-foreground hover:bg-muted"
          >
            {helpBlockchainLabel}
          </Link>
          <Link
            href="/how-it-works"
            onClick={closeMenu}
            className="block rounded-md px-2 py-1.5 text-foreground hover:bg-muted"
          >
            {helpHowItWorksLabel}
          </Link>
          <Link
            href="/settings"
            onClick={closeMenu}
            className="block rounded-md px-2 py-1.5 text-foreground hover:bg-muted"
          >
            {settingsLabel}
          </Link>
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

        <div className="my-3 h-px bg-border" />
        <div onClick={closeMenu}>{walletContent}</div>
      </div>
    </details>
  );
}
