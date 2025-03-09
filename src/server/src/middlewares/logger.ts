import { createLogger } from '@/utils/logger';
import { pinoLogger } from 'hono-pino';

export function logger() {
  const p = createLogger('SERVER', "{req.method} '{req.url}' -> {res.status}");

  return pinoLogger({
    pino: p,
    http: {
      reqId: () => crypto.randomUUID(),
    },
  });
}
