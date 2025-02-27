import getTeamsController from '@/controllers/team/getTeamList';
import type { HonoApp } from '@/models/app.model';
import { getTeamListRouteDef } from '@/openapi/team/getTeams';

export default (router: HonoApp) => {
  router.openapi(getTeamListRouteDef, getTeamsController);
};
