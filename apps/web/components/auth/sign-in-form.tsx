'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Button } from '@missing-you/ui';
import { actionBtnFullMobile } from '@/lib/ui/mobile-action-layout';

type Props = {
  callbackUrl: string;
};

export function SignInForm({ callbackUrl }: Props) {
  const t = useTranslations('auth');
  const [email, setEmail] = useState('');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setMessage(null);
    setError(null);

    const res = await signIn('email', {
      email,
      callbackUrl,
      redirect: false,
    });

    if (res?.error) {
      setError(t('sendError'));
    } else {
      setMessage(t('sent'));
    }

    setPending(false);
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-md space-y-5">
      <div>
        <label htmlFor="signin-email" className="block text-sm font-medium text-foreground">
          {t('email')}
        </label>
        <input
          id="signin-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
          placeholder="you@example.com"
        />
      </div>

      {message ? <p className="text-sm text-stone-600">{message}</p> : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <Button type="submit" className={actionBtnFullMobile} disabled={pending}>
        {pending ? t('sending') : t('send')}
      </Button>
    </form>
  );
}
