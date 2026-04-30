'use client';

import { useCallback, useState } from 'react';
import { useAccount, useChainId, useSwitchChain, useWriteContract } from 'wagmi';
import type { Journal } from '@missing-you/shared';
import {
  getDefaultAnchorChainId,
  getMemoryRegistryAddress,
  memoryRegistryAbi,
} from '@missing-you/shared';
import type { Hex } from 'viem';

export type AnchorPhase =
  | 'idle'
  | 'preparing'
  | 'switching'
  | 'signing'
  | 'confirming'
  | 'success'
  | 'error';

/**
 * Orchestrates: BFF prepare → wallet `anchorMemory` → BFF confirm with receipt hash.
 * Journal prose never leaves the browser for the chain call — only `memoryId` and `contentHash` bytes.
 */
export function useAnchorMemory(journalId: string, onRefresh: () => Promise<void>) {
  const { address } = useAccount();
  const activeChainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();

  const [phase, setPhase] = useState<AnchorPhase>('idle');
  const [error, setError] = useState<string | null>(null);
  const [lastTxHash, setLastTxHash] = useState<Hex | null>(null);

  const targetChainId = getDefaultAnchorChainId();

  const reset = useCallback(() => {
    setPhase('idle');
    setError(null);
    setLastTxHash(null);
  }, []);

  const recoverFromConfirmedTx = useCallback(
    async (txHash: Hex) => {
      const contract = getMemoryRegistryAddress();
      if (!contract) {
        setError('NEXT_PUBLIC_MEMORY_REGISTRY_ADDRESS is not set');
        setPhase('error');
        return;
      }

      setError(null);
      setPhase('confirming');
      try {
        const conf = await fetch(`/api/journals/${journalId}/confirm-anchor`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            txHash,
            chainId: targetChainId,
            contractAddress: contract,
          }),
        });
        if (!conf.ok) {
          const body = (await conf.json().catch(() => ({}))) as { error?: string };
          throw new Error(typeof body.error === 'string' ? body.error : 'confirm failed');
        }

        setLastTxHash(txHash);
        setPhase('success');
        await onRefresh();
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Anchor recovery failed';
        setError(msg);
        setPhase('error');
      }
    },
    [journalId, onRefresh, targetChainId]
  );

  const runAnchor = useCallback(async () => {
    setError(null);
    setLastTxHash(null);

    const contract = getMemoryRegistryAddress();
    if (!contract) {
      setError('NEXT_PUBLIC_MEMORY_REGISTRY_ADDRESS is not set');
      setPhase('error');
      return;
    }
    if (!address) {
      setError('CONNECT_WALLET');
      setPhase('error');
      return;
    }

    try {
      setPhase('preparing');
      const prepRes = await fetch(`/api/journals/${journalId}/prepare-anchor`, { method: 'POST' });
      if (!prepRes.ok) {
        const body = (await prepRes.json().catch(() => ({}))) as { error?: string };
        throw new Error(typeof body.error === 'string' ? body.error : 'prepare failed');
      }
      const prepared = (await prepRes.json()) as {
        memoryIdBytes32: Hex;
        contentHash: Hex;
        shareable: boolean;
      };

      if (activeChainId !== targetChainId) {
        setPhase('switching');
        if (!switchChainAsync) {
          throw new Error('SWITCH_NETWORK');
        }
        await switchChainAsync({ chainId: targetChainId });
      }

      setPhase('signing');
      const txHash = await writeContractAsync({
        address: contract,
        abi: memoryRegistryAbi,
        functionName: 'anchorMemory',
        args: [prepared.memoryIdBytes32, prepared.contentHash, prepared.shareable],
        chainId: targetChainId,
      });
      setLastTxHash(txHash);

      setPhase('confirming');
      const conf = await fetch(`/api/journals/${journalId}/confirm-anchor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txHash,
          chainId: targetChainId,
          contractAddress: contract,
        }),
      });
      if (!conf.ok) {
        const body = (await conf.json().catch(() => ({}))) as { error?: string };
        throw new Error(typeof body.error === 'string' ? body.error : 'confirm failed');
      }

      setPhase('success');
      await onRefresh();
    } catch (e: unknown) {
      const short =
        e && typeof e === 'object' && 'shortMessage' in e
          ? String((e as { shortMessage?: string }).shortMessage)
          : undefined;
      const msg =
        short ||
        (e instanceof Error ? e.message : 'Anchor failed');
      if (msg.includes('User rejected') || msg.includes('denied')) {
        setError('USER_REJECTED');
      } else if (msg.includes('AlreadyAnchored') || msg.toLowerCase().includes('already anchored')) {
        setError('ALREADY_ANCHORED');
      } else if (
        msg === 'SWITCH_NETWORK' ||
        msg.includes('does not match the target chain') ||
        msg.includes('wrong network')
      ) {
        setError('SWITCH_NETWORK');
      } else {
        setError(msg);
      }
      setPhase('error');
    }
  }, [activeChainId, address, journalId, onRefresh, switchChainAsync, targetChainId, writeContractAsync]);

  return { phase, error, lastTxHash, runAnchor, recoverFromConfirmedTx, reset };
}
