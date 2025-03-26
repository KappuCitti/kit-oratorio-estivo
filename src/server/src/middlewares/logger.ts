import { createLogger } from '@/utils/logger';
import { pinoLogger } from 'hono-pino';

export function logger() {
  const p = createLogger('SERVER', "{if req.url}{req.method} '{req.url}' -> {res.status} {end}{msg}"); 

  return pinoLogger({
    pino: p,
    http: {
      reqId: () => crypto.randomUUID(),
    },
  });
}
