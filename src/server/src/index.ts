import config from '@/config';
import createApp from '@/utils/createApp';
import '@/globals';

const app = createApp();

export default {
  port: config.port,
  fetch: app.fetch,
};
