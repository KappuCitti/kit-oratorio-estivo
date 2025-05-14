import { z } from 'zod';
import { LOG_LEVELS } from './logger.model';

export const configSchema = z
  .object({
    server: z.object({
      port: z.number().int().positive().default(3000),
      host: z.string().default('0.0.0.0'),
      routesPrefix: z.string().default('/'),
      domain: z.string().default('localhost'),
      frontendPort: z.number().int().positive().default(443),
    }),
    musicFolder: z.string().default('../public/music'),
    database: z.object({
      host: z.string(),
      port: z.number().int().positive().default(3306),
      user: z.string().default('root'),
      password: z.string().optional(),
      database: z.string().default('oratorio'),
      waitForConnections: z.boolean().default(true),
      connectionLimit: z.number().int().positive().default(10),
      queueLimit: z.number().int().positive().default(10),
    }),
    logs: z.object({
      logLevel: z.enum(LOG_LEVELS).default('info'),
      logFolder: z.string().default('logs'),
    }),
  })
  .and(
    z.discriminatedUnion('useHttps', [
      z.object({
        useHttps: z.literal(true),
        ssl: z.object({
          cert: z.string().default('ssl/cert.pem'),
          key: z.string().default('ssl/key.pem'),
        }),
      }),
      z.object({ useHttps: z.literal(false) }),
    ])
  );
export type Config = z.infer<typeof configSchema>;

export const envSchema = z.object({
  MUSIC_FOLDER: z.string().optional(),

  SERVER_PORT: z.coerce.number().int().positive().optional(),
  SERVER_HOST: z.string().optional(),
  SERVER_ROUTES_PREFIX: z.string().optional(),
  SERVER_USE_HTTPS: z.coerce.boolean().optional(),
  SERVER_FRONTEND_PORT: z.coerce.number().int().positive().optional(),
  SERVER_DOMAIN: z.string().optional(),

  HTTPS_CERT: z.string().optional(),
  HTTPS_KEY: z.string().optional(),

  LOG_LEVEL: z.enum(LOG_LEVELS).optional(),
  LOG_FOLDER: z.string().optional(),

  DB_HOST: z.string().optional(),
  DB_PORT: z.coerce.number().int().positive().optional(),
  DB_USER: z.string().optional(),
  DB_PASSWORD: z.string().optional(),
  DB_DATABASE: z.string().optional(),
  DB_WAIT_FOR_CONNECTIONS: z.coerce.boolean().optional(),
  DB_CONNECTION_LIMIT: z.coerce.number().int().positive().optional(),
  DB_QUEUE_LIMIT: z.coerce.number().int().positive().optional(),
});
export type EnvConfig = z.infer<typeof envSchema>;

export const tomlSchema = z.object({
  server: z
    .object({
      port: z.number().int().positive().optional(),
      host: z.string().optional(),
      routes_prefix: z.string().optional(),
      use_https: z.boolean().optional(),
      domain: z.string().optional(),
      frontend_port: z.number().int().positive().optional(),
      music_folder: z.string().optional(),
    })
    .optional(),
  https: z
    .object({
      cert: z.string().optional(),
      key: z.string().optional(),
    })
    .optional(),
  logs: z
    .object({
      log_level: z.enum(LOG_LEVELS).optional(),
      log_folder: z.string().optional(),
    })
    .optional(),
  database: z
    .object({
      host: z.string().optional(),
      port: z.number().int().positive().optional(),
      user: z.string().optional(),
      password: z.string().optional(),
      database: z.string().optional(),
      wait_for_connections: z.boolean().optional(),
      connection_limit: z.number().int().positive().optional(),
      queue_limit: z.number().int().positive().optional(),
      idleTimeout: z.number().int().positive().optional(),
    })
    .optional(),
});
export type TomlConfig = z.infer<typeof tomlSchema>;
