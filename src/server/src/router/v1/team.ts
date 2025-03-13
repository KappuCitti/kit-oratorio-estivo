import createTeamController from '@/controllers/team/createTeam';
import editTeamController from '@/controllers/team/editTeam';
import getTeamsController from '@/controllers/team/getTeamList';
import type { HonoApp } from '@/models/app.model';
import { createTeamRouteDef } from '@/openapi/team/createTeam';
import { editTeamRouteDef } from '@/openapi/team/editTeam';
import { getTeamListRouteDef } from '@/openapi/team/getTeams';

export default (router: HonoApp) => {
  router.openapi(getTeamListRouteDef, getTeamsController);
  router.openapi(createTeamRouteDef, createTeamController);
  router.openapi(editTeamRouteDef, editTeamController);
};
