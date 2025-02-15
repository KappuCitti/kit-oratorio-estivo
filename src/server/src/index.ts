import config from './config';
import createApp from './utils/createApp';

const app = createApp();

export default {
  port: config.port,
  fetch: app.fetch,
};
