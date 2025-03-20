import type { HonoApp } from '@/models/app.model';
import auth from './auth';
import main from './main';
import user from './user';
import enrollment from './enrollment';
import week from './week';
import team from './team';
import shirt from './shirt';
import children from './children';
import parent from './parent';
import people from './people';
import family from './family';
import attendance from './attendance';

export default (router: HonoApp) => {
  attendance(router);
  auth(router);
  children(router);
  enrollment(router);
  family(router);
  main(router);
  parent(router);
  people(router);
  shirt(router);
  team(router);
  user(router);
  week(router);
};
