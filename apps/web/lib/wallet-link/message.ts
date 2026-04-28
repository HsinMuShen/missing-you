import { randomBytes } from 'node:crypto';
import { getPublicAppUrl } from '@/lib/config/env';

export function createWalletLinkNonce(): string {
  return randomBytes(16).toString('hex');
}

export function buildWalletLinkMessage(params: {
  address: string;
  nonce: string;
  userId: string;
  issuedAt: string;
}) {
  const appUrl = getPublicAppUrl();
  const domain = new URL(appUrl).host;

  return [
    `Missing You wants to link this wallet to your account.`,
    '',
    `Domain: ${domain}`,
    `Address: ${params.address.toLowerCase()}`,
    `User ID: ${params.userId}`,
    `Nonce: ${params.nonce}`,
    `Issued At: ${params.issuedAt}`,
    '',
    'Sign this message to prove wallet ownership. No gas is required.',
  ].join('\n');
}
