import { randomUUID } from 'node:crypto';

type Level = 'info' | 'warn' | 'error';

type LogMeta = Record<string, unknown>;

function write(level: Level, message: string, meta?: LogMeta) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    message,
    ...meta,
  };
  const line = JSON.stringify(payload);
  if (level === 'error') {
    console.error(line);
  } else if (level === 'warn') {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export function getRequestId(req?: Request): string {
  const fromHeader = req?.headers.get('x-request-id')?.trim();
  return fromHeader || randomUUID();
}

export function serializeError(err: unknown): LogMeta {
  if (err instanceof Error) {
    return {
      errorName: err.name,
      errorMessage: err.message,
      errorStack: err.stack,
    };
  }
  return {
    error: String(err),
  };
}

export const logger = {
  info(message: string, meta?: LogMeta) {
    write('info', message, meta);
  },
  warn(message: string, meta?: LogMeta) {
    write('warn', message, meta);
  },
  error(message: string, meta?: LogMeta) {
    write('error', message, meta);
  },
};
