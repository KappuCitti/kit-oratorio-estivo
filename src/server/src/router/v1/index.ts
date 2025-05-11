import type { HonoApp } from '@/models/app.model';
import auth from './auth';
import main from './main';
import enrollment from './enrollment';
import week from './week';
import team from './team';
import shirt from './shirt';

export default (router: HonoApp) => {
  auth(router);
  enrollment(router);
  main(router);
  shirt(router);
  team(router);
  week(router);
};
