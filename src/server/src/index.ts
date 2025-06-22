import config from '@/config';
import createApp from '@/utils/createApp';
import '@/globals';

const app = createApp();

export default {
  port: config.server.port,
  fetch: app.fetch,
  tls: config.useHttps
    ? {
        cert: Bun.file(config.https.cert),
        key: Bun.file(config.https.key),
      }
    : undefined,
};
