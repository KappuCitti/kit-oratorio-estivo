import config from '@/config';
import createApp from '@/utils/createApp';
import '@/globals';

const app = createApp();

export default {
  port: config.port,
  fetch: app.fetch,
  tls: config.useHttps
    ? {
        cert: Bun.file(config.ssl?.cert as string),
        key: Bun.file(config.ssl?.key as string),
      }
    : undefined,
};
