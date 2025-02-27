import type { HonoApp } from '@/models/app.model';
import auth from './auth';
import main from './main';
import user from './user';
import enrollment from './enrollment';
import week from './week';
import team from './team';

export default (router: HonoApp) => {
  main(router);
  auth(router);
  user(router);
  enrollment(router);
  week(router);
  team(router);
};
