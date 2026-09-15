import config from '@/config';
import pino from 'pino';
import path from 'path';

/**
 * Campi che non devono mai finire su disco.
 *
 * I log storici contengono hash argon2 e token di sessione validi: chiunque
 * legga un file di log puo' impersonare un utente. La redazione copre i
 * percorsi piu' comuni, ma la regola vera resta non loggare oggetti interi
 * (usa campi espliciti, non `%o` su una riga del database).
 */
const REDACTED_PATHS = [
  'password',
  '*.password',
  'newPassword',
  '*.newPassword',
  'oldPassword',
  '*.oldPassword',
  'token',
  '*.token',
  'user_token',
  '*.user_token',
  'req.headers.cookie',
  'req.headers.authorization',
  'res.headers["set-cookie"]',
];

export function createLogger(name?: string, format?: string) {
  return pino({
    level: config.logs.logLevel,
    name,
    redact: { paths: REDACTED_PATHS, censor: '[redacted]' },
    transport: {
      pipeline: [
        {
          target: 'pino-pretty',
          options: {
            colorize: true,
            messageFormat: format,
            hideObject: true,
          },
        },
        {
          target: 'pino-roll',
          options: {
            file: path.join(config.logs.logFolder, 'log'),
            extension: '.log',
            frequency: 'daily',
            dateFormat: 'yyyy-MM-dd',
            mkdir: true,
          },
        },
      ],
    },
  });
}
