'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { Button } from '@missing-you/ui';
import { useTranslations } from 'next-intl';
import { actionBtnFullMobile, mobileStackActionsBetween } from '@/lib/ui/mobile-action-layout';

type Props = {
  linkedWalletAddress: string | null;
};

export function WalletLinkControls({ linkedWalletAddress }: Props) {
  const t = useTranslations('settings.wallet');
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const [status, setStatus] = useState<'idle' | 'linking' | 'unlinking'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const autoLinkAttemptedRef = useRef<string | null>(null);

  const normalizedLinked = linkedWalletAddress?.toLowerCase() ?? null;
  const hasLinkedWallet = Boolean(normalizedLinked);

  const linkWallet = useCallback(async () => {
    if (!address) {
      setError(t('connectFirst'));
      return;
    }

    setStatus('linking');
    setError(null);
    setMessage(null);

    try {
      const challengeRes = await fetch('/api/account/wallet/link-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });
      const challengeJson = await challengeRes.json().catch(() => ({}));
      if (!challengeRes.ok || typeof challengeJson.message !== 'string') {
        throw new Error(typeof challengeJson.error === 'string' ? challengeJson.error : t('linkFailed'));
      }

      const signature = await signMessageAsync({ message: challengeJson.message });
      const confirmRes = await fetch('/api/account/wallet/link-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, signature }),
      });
      const confirmJson = await confirmRes.json().catch(() => ({}));
      if (!confirmRes.ok) {
        throw new Error(typeof confirmJson.error === 'string' ? confirmJson.error : t('linkFailed'));
      }

      setMessage(t('linkedSuccess'));
      setTimeout(() => window.location.reload(), 500);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('linkFailed'));
    } finally {
      setStatus('idle');
    }
  }, [address, signMessageAsync, t]);

  async function unlinkWallet() {
    setStatus('unlinking');
    setError(null);
    setMessage(null);

    try {
      const res = await fetch('/api/account/wallet/unlink', { method: 'POST' });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof json.error === 'string' ? json.error : t('unlinkFailed'));
      }
      setMessage(t('unlinkedSuccess'));
      setTimeout(() => window.location.reload(), 400);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('unlinkFailed'));
    } finally {
      setStatus('idle');
    }
  }

  useEffect(() => {
    if (!isConnected || !address) return;
    if (hasLinkedWallet) return;
    if (status !== 'idle') return;

    const current = address.toLowerCase();
    if (autoLinkAttemptedRef.current === current) return;
    autoLinkAttemptedRef.current = current;
    void linkWallet();
  }, [address, hasLinkedWallet, isConnected, linkWallet, status]);

  return (
    <div className="space-y-3">
      <div className={`${mobileStackActionsBetween} sm:items-center`}>
        <p className="min-w-0 flex-1 truncate text-foreground" title={linkedWalletAddress ?? t('notLinked')}>
          {linkedWalletAddress ?? t('notLinked')}
        </p>
        {hasLinkedWallet ? (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className={actionBtnFullMobile}
            onClick={() => void unlinkWallet()}
            disabled={status !== 'idle'}
          >
            {status === 'unlinking' ? t('unlinking') : t('unlink')}
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            className={actionBtnFullMobile}
            onClick={() => void linkWallet()}
            disabled={!isConnected || status !== 'idle'}
          >
            {status === 'linking' ? t('linking') : t('link')}
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">{t('hint')}</p>
      {message ? <p className="text-sm text-stone-600">{message}</p> : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
