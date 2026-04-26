import { z } from 'zod';

export const journalIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const confirmAnchorBodySchema = z.object({
  txHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
  chainId: z.number().int().positive(),
  contractAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
});

export const updateShareabilitySchema = z
  .object({
    privacy: z.enum(['private', 'share']),
    txHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/).optional(),
    chainId: z.number().int().positive().optional(),
    contractAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  })
  .superRefine((data, ctx) => {
    const provided = [data.txHash, data.chainId, data.contractAddress].filter((v) => v !== undefined).length;
    if (provided !== 0 && provided !== 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'txHash, chainId, and contractAddress must be provided together',
      });
    }
  });
