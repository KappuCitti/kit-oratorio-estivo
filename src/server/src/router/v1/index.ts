import type { HonoApp } from '@/models/app.model';
import auth from './auth';
import main from './main';
import enrollment from './enrollment';
import week from './week';
import team from './team';
import shirt from './shirt';
import user from './user';
import activity from './activity';
import school from './school';
import _class from './class';

export default (router: HonoApp) => {
  activity(router);
  auth(router);
  _class(router);
  enrollment(router);
  main(router);
  school(router);
  shirt(router);
  team(router);
  user(router);
  week(router);
};
