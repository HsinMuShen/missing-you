import { z } from 'zod';

const journalPrivacySchema = z.enum(['private', 'share']);
const journalStatusSchema = z.enum(['draft', 'anchored']);

export const journalCreateSchema = z.object({
  content: z.string().min(1).max(50_000),
  person: z.string().max(200).nullable().optional(),
  privacy: journalPrivacySchema,
});

export type JournalCreateInput = z.infer<typeof journalCreateSchema>;

/**
 * Canonical payload shape — must match `buildCanonicalPayload` in the web app exactly.
 */
export const canonicalPayloadSchema = z.object({
  version: z.literal(1),
  content: z.string(),
  person: z.string().nullable(),
  createdAt: z.string().min(1),
  memoryId: z.string().min(1),
});

export type CanonicalPayloadInput = z.infer<typeof canonicalPayloadSchema>;

export { journalPrivacySchema, journalStatusSchema };
