import { prisma } from '@/lib/db/client';
import type { Journal as JournalRow, MemoryAnchor, Prisma } from '@prisma/client';

const journalInclude = { anchor: true } satisfies Prisma.JournalInclude;

export type JournalWithAnchor = JournalRow & { anchor: MemoryAnchor | null };

export async function createJournal(data: {
  userId: string;
  content: string;
  person: string | null;
  privacy: string;
  createdAt?: Date;
}): Promise<JournalRow> {
  return prisma.journal.create({
    data: {
      userId: data.userId,
      content: data.content,
      person: data.person,
      privacy: data.privacy,
      status: 'draft',
      ...(data.createdAt ? { createdAt: data.createdAt } : {}),
    },
  });
}

export async function getJournalById(id: string): Promise<JournalWithAnchor | null> {
  return prisma.journal.findUnique({
    where: { id },
    include: journalInclude,
  });
}

export async function listJournals(userId: string): Promise<JournalWithAnchor[]> {
  return prisma.journal.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: journalInclude,
  });
}

export async function updateJournal(
  id: string,
  data: Prisma.JournalUpdateInput
): Promise<JournalRow> {
  return prisma.journal.update({
    where: { id },
    data,
  });
}

export async function setJournalMemoryId(journalId: string, memoryId: string): Promise<JournalRow> {
  return prisma.journal.update({
    where: { id: journalId },
    data: { memoryId },
  });
}

export async function markAsAnchored(params: {
  journalId: string;
  memoryId: string;
  contentHash: string;
  txHash: string;
  chain: string;
  chainId: number;
  contractAddress: string;
}): Promise<{ journal: JournalRow; anchor: MemoryAnchor }> {
  return prisma.$transaction(async (tx) => {
    const journal = await tx.journal.update({
      where: { id: params.journalId },
      data: { status: 'anchored' },
    });

    const anchor = await tx.memoryAnchor.create({
      data: {
        journalId: params.journalId,
        memoryId: params.memoryId,
        contentHash: params.contentHash,
        txHash: params.txHash,
        chain: params.chain,
        chainId: params.chainId,
        contractAddress: params.contractAddress,
        anchoredAt: new Date(),
      },
    });

    return { journal, anchor };
  });
}
