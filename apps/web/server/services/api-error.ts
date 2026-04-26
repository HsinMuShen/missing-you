import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { JournalServiceError } from '@/server/services/journal.service';
import { getRequestId, logger, serializeError } from '@/lib/observability/logger';

export type ApiErrorBody = {
  error: string;
  code: string;
  requestId: string;
};

export function jsonApiError(
  status: number,
  body: Omit<ApiErrorBody, 'requestId'>,
  requestId: string
) {
  return NextResponse.json(
    {
      ...body,
      requestId,
    },
    { status }
  );
}

export function jsonError(err: unknown, req?: Request) {
  const requestId = getRequestId(req);

  if (err instanceof JournalServiceError) {
    return jsonApiError(
      err.status,
      { error: err.message, code: `JOURNAL_${err.code}` },
      requestId
    );
  }

  if (err instanceof ZodError) {
    return jsonApiError(400, { error: 'Invalid request body', code: 'VALIDATION_ERROR' }, requestId);
  }

  if (err instanceof SyntaxError) {
    return jsonApiError(400, { error: 'Malformed JSON body', code: 'INVALID_JSON' }, requestId);
  }

  if (err instanceof Error && err.message === 'UNAUTHORIZED') {
    return jsonApiError(401, { error: 'Unauthorized', code: 'UNAUTHORIZED' }, requestId);
  }

  logger.error('Unhandled API error', { requestId, ...serializeError(err) });
  return jsonApiError(500, { error: 'Internal server error', code: 'INTERNAL_ERROR' }, requestId);
}
