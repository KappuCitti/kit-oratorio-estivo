import config from '@/config';
import { pinoLogger } from 'hono-pino';
import pino from 'pino';
import pretty from 'pino-pretty';

export function logger() {
  const p = pino(
    {
      level: config.logLevel,
    },
    pretty({
      colorize: true,
      messageFormat: "{req.method} '{req.url}' -> {res.status}",
      hideObject: true,
    })
  );

  return pinoLogger({
    pino: p,
    http: {
      reqId: () => crypto.randomUUID(),
    },
  });
}
