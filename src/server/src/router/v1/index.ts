import type { HonoApp } from '@/models/app.model';
import auth from './auth';
import main from './main';
import user from './user';
import enrollment from './enrollment';
import week from './week';
import team from './team';
import shirt from './shirt';
import children from './children';

export default (router: HonoApp) => {
  auth(router);
  children(router);
  enrollment(router);
  main(router);
  shirt(router);
  team(router);
  user(router);
  week(router);
};
