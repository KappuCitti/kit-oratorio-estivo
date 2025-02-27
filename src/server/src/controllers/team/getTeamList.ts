import { HttpStatusCodes } from '@/codes';
import { getTeamList } from '@/database/team/getTeamList';
import type { RouteController } from '@/models/app.model';
import type { GetTeamListRoute } from '@/openapi/team/getTeams';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const getTeamsController: RouteController<GetTeamListRoute> = async (c) => {
  const teams = await getTeamList();
  if (!teams.success)
    return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  return httpSuccessResponse(c, teams.data);
};

export default getTeamsController;
