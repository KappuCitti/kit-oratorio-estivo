import { createRouter } from '@/utils/createApp';
import v1 from './v1';

export default () => {
  const router = createRouter();
  v1(router);
  return router;
};
