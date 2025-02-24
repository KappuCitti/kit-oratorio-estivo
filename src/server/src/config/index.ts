import { parse } from 'toml';
import { existsSync, readFileSync } from 'node:fs';
import { config as loadEnv } from 'dotenv';
import path from 'node:path';
import { z } from 'zod';
loadEnv({ path: path.join(__dirname, './.env') });

if (!existsSync(path.join(__dirname, './config.toml'))) {
  console.error('config.toml not found');
  process.exit(1);
}

const tomlSchema = z.object({
  server: z.object({
    port: z.number().int().positive().default(3000),
    host: z.string().default('0.0.0.0'),
    routes_prefix: z.string().default('/api/v1'),
    use_https: z.boolean().default(false),
    domain: z.string().default('localhost'),
    frontend_port: z.number().int().positive().default(443),
  }),
  https: z.object({
    cert: z.string().default('ssl/cert.pem'),
    key: z.string().default('ssl/key.pem'),
  }),
  logs: z.object({
    log_level: z
      .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
      .default('info'),
    log_folder: z.string().default('./logs'),
  }),
  database: z.object({
    wait_for_connections: z.boolean().default(true),
    connection_limit: z.number().int().positive().default(10),
    queue_limit: z.number().int().positive().default(10),
  }),
});

const envSchema = z.object({
  MUSIC_FOLDER: z.string().default('../public/music'),
  MYSQL_HOST: z.string(),
  MYSQL_PORT: z.coerce.number().int().positive().default(3306),
  MYSQL_USER: z.string(),
  MYSQL_PASSWORD: z.string(),
  MYSQL_DATABASE: z.string().default('oratorio'),

  SERVER_PORT: z.coerce.number().int().positive().optional(),
  SERVER_HOST: z.string().optional(),
});

let env!: z.infer<typeof envSchema>;
let config!: z.infer<typeof tomlSchema>;

try {
  env = envSchema.parse(process.env);
  config = tomlSchema.parse(
    parse(readFileSync(path.join(__dirname, './config.toml'), 'utf-8'))
  );
} catch (e) {
  const error = e as z.ZodError;
  console.error(error.flatten().fieldErrors);
  process.exit(1);
}

if (config.server.use_https) {
  if (
    !(await Bun.file(config.https.cert).exists()) ||
    !(await Bun.file(config.https.key).exists())
  ) {
    console.error('ssl/cert.pem or ssl/key.pem not found');
    process.exit(1);
  }
}

const cfgObject = {
  // Server configs
  port: env.SERVER_PORT || config.server.port,
  host: env.SERVER_HOST || config.server.host,
  routesPrefix: config.server.routes_prefix,
  useHttps: config.server.use_https,
  domain: config.server.domain,
  frontendPort: config.server.frontend_port,
  ssl: config.server.use_https
    ? { cert: config.https.cert, key: config.https.key }
    : undefined,

  // Public folder configs
  musicFolder: env.MUSIC_FOLDER,

  logLevel: config.logs.log_level || 'info',
  logFolder: config.logs.log_folder,

  // Database configs
  database: {
    host: env.MYSQL_HOST,
    port: env.MYSQL_PORT,
    user: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE,
    waitForConnections: config.database.wait_for_connections,
    connectionLimit: config.database.connection_limit,
    queueLimit: config.database.queue_limit,
    idleTimeout: 60 * 60 * 24 * 365,
  },
} as const;

export default cfgObject;
