import { getTeamList } from '@/database/team/getTeamList';
import type { RouteController } from '@/models/app.model';
import type { GetTeamListRoute } from '@/openapi/team/getTeams';
import { httpSuccessResponse } from '@/utils/responses';

const getTeamsController: RouteController<GetTeamListRoute> = async (c) => {
  const teams = await getTeamList();
  return httpSuccessResponse(c, teams);
};

export default getTeamsController;
