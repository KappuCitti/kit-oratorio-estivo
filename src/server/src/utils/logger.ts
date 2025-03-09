import config from '@/config';
import pino from 'pino';
import pretty from 'pino-pretty';

export function createLogger(name?: string, format?: string) {
  return pino(
    {
      level: config.logLevel,
      name,
    },
    pretty({
      colorize: true,
      messageFormat: format,
      hideObject: true,
    })
  );
}
