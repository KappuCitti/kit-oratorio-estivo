import usersStatsController from '@/controllers/stats/users';
import type { HonoApp } from '@/models/app.model';
import { usersStatsRouteDef } from '@/openapi/stats/users';

export default (router: HonoApp) => {
  router.openapi(usersStatsRouteDef, usersStatsController);
};
