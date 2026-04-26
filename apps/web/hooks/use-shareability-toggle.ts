'use client';

import { useCallback, useState } from 'react';
import { useAccount, useChainId, useSwitchChain, useWriteContract } from 'wagmi';
import {
  getDefaultAnchorChainId,
  getMemoryRegistryAddress,
  journalUuidToMemoryIdKey,
  memoryRegistryAbi,
  type Journal,
} from '@missing-you/shared';

export type ShareabilityPhase = 'idle' | 'switching' | 'signing' | 'saving' | 'success' | 'error';

export function useShareabilityToggle(journal: Journal, onRefresh: () => Promise<void>) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();

  const [phase, setPhase] = useState<ShareabilityPhase>('idle');
  const [error, setError] = useState<string | null>(null);

  const toggle = useCallback(async () => {
    setError(null);
    const nextPrivacy = journal.privacy === 'share' ? 'private' : 'share';

    try {
      let txHash: string | undefined;
      let txChainId: number | undefined;
      let contractAddress: string | undefined;

      if (journal.status === 'anchored') {
        if (!isConnected) {
          setError('CONNECT_WALLET');
          setPhase('error');
          return;
        }

        if (!journal.memoryId) {
          throw new Error('Missing memoryId');
        }

        const targetChain = getDefaultAnchorChainId();
        contractAddress = journal.anchor?.contractAddress ?? getMemoryRegistryAddress();
        if (!contractAddress) {
          throw new Error('NEXT_PUBLIC_MEMORY_REGISTRY_ADDRESS is not set');
        }

        if (chainId !== targetChain) {
          setPhase('switching');
          if (!switchChainAsync) throw new Error('SWITCH_NETWORK');
          await switchChainAsync({ chainId: targetChain });
        }

        setPhase('signing');
        txHash = await writeContractAsync({
          address: contractAddress as `0x${string}`,
          abi: memoryRegistryAbi,
          functionName: 'setShareable',
          args: [journalUuidToMemoryIdKey(journal.memoryId), nextPrivacy === 'share'],
          chainId: targetChain,
        });
        txChainId = targetChain;
      }

      setPhase('saving');
      const res = await fetch(`/api/journals/${journal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          privacy: nextPrivacy,
          txHash,
          chainId: txChainId,
          contractAddress,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(typeof body.error === 'string' ? body.error : 'Could not update shareability');
      }

      setPhase('success');
      await onRefresh();
    } catch (e) {
      const short =
        e && typeof e === 'object' && 'shortMessage' in e
          ? String((e as { shortMessage?: string }).shortMessage)
          : undefined;
      const message = short || (e instanceof Error ? e.message : 'Could not update shareability');
      if (message.includes('rejected') || message.includes('denied')) {
        setError('USER_REJECTED');
      } else if (message === 'SWITCH_NETWORK') {
        setError('SWITCH_NETWORK');
      } else {
        setError(message);
      }
      setPhase('error');
    }
  }, [
    chainId,
    isConnected,
    journal.anchor?.contractAddress,
    journal.id,
    journal.memoryId,
    journal.privacy,
    journal.status,
    onRefresh,
    switchChainAsync,
    writeContractAsync,
  ]);

  return { phase, error, toggle };
}
