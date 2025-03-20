import { parse } from 'toml';
import { existsSync, readFileSync } from 'node:fs';
import { config as loadEnv } from 'dotenv';
import path from 'node:path';
import { configSchema, envSchema, tomlSchema } from '@/models/config.model';
loadEnv({ path: path.join(__dirname, './.env') });

if (!existsSync(path.join(__dirname, './config.toml'))) {
  console.error('config.toml not found');
  process.exit(1);
}

const envRes = envSchema.safeParse(process.env);
if (!envRes.success) {
  console.error('Error while parsing environment variables');
  console.error(envRes.error.issues);
  process.exit(1);
}
const env = envRes.data;

const tomlFileRes = tomlSchema.safeParse(
  parse(readFileSync(path.join(__dirname, './config.toml'), 'utf-8'))
);
if (!tomlFileRes.success) {
  console.error('Error while parsing toml file');
  console.error(tomlFileRes.error.issues);
  process.exit(1);
}
const tomlFile = tomlFileRes.data;

const config = configSchema.safeParse({
  server: {
    host: env.SERVER_HOST ?? tomlFile.server.host,
    port: env.SERVER_PORT ?? tomlFile.server.port,
    routesPrefix: env.SERVER_ROUTES_PREFIX ?? tomlFile.server.routes_prefix,
    domain: env.SERVER_DOMAIN ?? tomlFile.server.domain,
    frontendPort: env.SERVER_FRONTEND_PORT ?? tomlFile.server.frontend_port,
  },
  useHttps: env.SERVER_USE_HTTPS ?? tomlFile.server.use_https ? true : false,
  https: {
    cert: env.HTTPS_CERT ?? tomlFile.https.cert,
    key: env.HTTPS_KEY ?? tomlFile.https.key,
  },
  logs: {
    logLevel: env.LOG_LEVEL ?? tomlFile.logs.log_level,
    logFolder: env.LOG_FOLDER ?? tomlFile.logs.log_folder,
  },
  database: {
    host: env.DB_HOST ?? tomlFile.database.host,
    port: env.DB_PORT ?? tomlFile.database.port,
    user: env.DB_USER ?? tomlFile.database.user,
    password: env.DB_PASSWORD ?? tomlFile.database.password,
    database: env.DB_DATABASE ?? tomlFile.database.database,
    waitForConnections:
      env.DB_WAIT_FOR_CONNECTIONS ?? tomlFile.database.wait_for_connections,
    connectionLimit:
      env.DB_CONNECTION_LIMIT ?? tomlFile.database.connection_limit,
    queueLimit: env.DB_QUEUE_LIMIT ?? tomlFile.database.queue_limit,
    idleTimeout: 60 * 60 * 24 * 365,
  },
  musicFolder: env.MUSIC_FOLDER ?? tomlFile.server.music_folder,
});
if (!config.success) {
  console.error('Error while parsing config');
  console.error(config.error.issues);
  process.exit(1);
}

export default config.data;
