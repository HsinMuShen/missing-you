'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@missing-you/ui';
import { Link } from '@/lib/i18n/navigation';
import { actionBtnFullMobile, mobileStackActionsEnd } from '@/lib/ui/mobile-action-layout';

const STORAGE_KEY = 'missing-you:v1:firstWelcomeDismissed';

type Props = {
  /** True when the user has zero memories (after fetch completes). */
  isEmpty: boolean;
};

export function FirstSessionWelcome({ isEmpty }: Props) {
  const t = useTranslations('journals.onboarding');
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isEmpty) return;
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) {
        setOpen(true);
        setStep(0);
      }
    } catch {
      setOpen(true);
    }
  }, [isEmpty]);

  if (!open) return null;

  function dismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  const rawBullets = t.raw('trustBullets') as string[];
  const bullets = Array.isArray(rawBullets) ? rawBullets : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="first-welcome-title"
    >
      <div className="max-h-[min(90vh,640px)] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-border bg-card shadow-xl sm:rounded-2xl">
        <div className="space-y-4 p-5 sm:p-6">
          {step === 0 ? (
            <>
              <h2 id="first-welcome-title" className="font-display text-xl font-medium text-foreground sm:text-2xl">
                {t('welcomeTitle')}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{t('welcomeBody')}</p>
            </>
          ) : null}

          {step === 1 ? (
            <>
              <h2 id="first-welcome-title" className="font-display text-xl font-medium text-foreground sm:text-2xl">
                {t('trustTitle')}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{t('trustLead')}</p>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground">
                {bullets.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <h2 id="first-welcome-title" className="font-display text-xl font-medium text-foreground sm:text-2xl">
                {t('ctaTitle')}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{t('ctaBody')}</p>
            </>
          ) : null}

          <div className={`${mobileStackActionsEnd} pt-2`}>
            <Button type="button" variant="secondary" size="sm" className={actionBtnFullMobile} onClick={dismiss}>
              {t('skip')}
            </Button>
            {step < 2 ? (
              <Button type="button" size="sm" className={actionBtnFullMobile} onClick={() => setStep((s) => s + 1)}>
                {t('next')}
              </Button>
            ) : (
              <Button asChild size="sm" className={actionBtnFullMobile}>
                <Link href="/write" onClick={dismiss}>
                  {t('startWriting')}
                </Link>
              </Button>
            )}
          </div>

          <p className="text-center text-[11px] text-muted-foreground">
            {step + 1} / 3
          </p>
        </div>
      </div>
    </div>
  );
}
