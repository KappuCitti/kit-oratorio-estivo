import type { HonoApp } from '@/models/app.model';
import auth from './auth';
import main from './main';
import enrollment from './enrollment';
import week from './week';
import team from './team';
import shirt from './shirt';
import user from './user';
import activity from './activity';

export default (router: HonoApp) => {
  activity(router);
  auth(router);
  enrollment(router);
  main(router);
  shirt(router);
  team(router);
  user(router);
  week(router);
};
