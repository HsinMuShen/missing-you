'use client';

import { useState } from 'react';
import { Button } from '@missing-you/ui';
import { useTranslations } from 'next-intl';
import { actionBtnFullMobile, mobileStackActionsBetween } from '@/lib/ui/mobile-action-layout';

type Privacy = 'private' | 'share';

export function DefaultPrivacyControl({ initialValue }: { initialValue: Privacy }) {
  const t = useTranslations('settings.privacy');
  const [value, setValue] = useState<Privacy>(initialValue);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    if (value === initialValue) return;

    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch('/api/account/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ defaultPrivacy: value }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof json.error === 'string' ? json.error : t('saveFailed'));
      }

      setMessage(t('saved'));
      setTimeout(() => window.location.reload(), 300);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('saveFailed'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className={`${mobileStackActionsBetween} sm:items-center`}>
        <select
          value={value}
          onChange={(e) => setValue(e.target.value as Privacy)}
          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground sm:w-auto sm:min-w-[12rem]"
          disabled={saving}
          aria-label={t('label')}
        >
          <option value="private">{t('private')}</option>
          <option value="share">{t('share')}</option>
        </select>

        <Button
          type="button"
          size="sm"
          className={actionBtnFullMobile}
          onClick={() => void save()}
          disabled={saving || value === initialValue}
        >
          {saving ? t('saving') : t('save')}
        </Button>
      </div>

      {message ? <p className="text-sm text-stone-600">{message}</p> : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
