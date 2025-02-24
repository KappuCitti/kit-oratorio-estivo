import type { HonoApp } from '@/models/app.model';
import auth from './auth';
import main from './main';
import user from './user';

export default (router: HonoApp) => {
  main(router);
  auth(router);
  user(router);
};
