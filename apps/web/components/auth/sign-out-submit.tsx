'use client';

import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';

type Props = {
  label: string;
  className?: string;
};

export function SignOutSubmit({ label, className }: Props) {
  const { pending } = useFormStatus();
  const t = useTranslations('auth');

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-foreground hover:bg-muted disabled:opacity-60 ${className ?? ''}`}
    >
      {pending ? (
        <>
          <span
            className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-muted-foreground/40 border-t-foreground"
            aria-hidden
          />
          <span>{t('signingOut')}</span>
        </>
      ) : (
        label
      )}
    </button>
  );
}
