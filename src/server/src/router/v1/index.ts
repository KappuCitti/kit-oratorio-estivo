import type { HonoApp } from '@/models/app.model';
import auth from './auth';
import main from './main';

export default (router: HonoApp) => {
  main(router);
  auth(router);
};
