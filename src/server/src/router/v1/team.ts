import createTeamController from '@/controllers/team/createTeam';
import deleteTeamController from '@/controllers/team/deleteTeam';
import getTeamsController from '@/controllers/team/getTeamList';
import type { HonoApp } from '@/models/app.model';
import { createTeamRouteDef } from '@/openapi/team/createTeam';
import { deleteTeamRouteDef } from '@/openapi/team/deleteTeam';
import { getTeamListRouteDef } from '@/openapi/team/getTeams';

export default (router: HonoApp) => {
  router.openapi(getTeamListRouteDef, getTeamsController);
  router.openapi(createTeamRouteDef, createTeamController);
  router.openapi(deleteTeamRouteDef, deleteTeamController);
};
