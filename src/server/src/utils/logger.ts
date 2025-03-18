import config from '@/config';
import pino from 'pino';
import path from 'path';

export function createLogger(name?: string, format?: string) {
  return pino({
    level: config.logLevel,
    name,
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
            file: path.join(config.logFolder, 'log'),
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
