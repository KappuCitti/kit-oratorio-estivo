import { HttpStatusCodes } from '@/codes';
import { createTeam } from '@/database/team/createTeam';
import type { RouteController } from '@/models/app.model';
import type { CreateTeamRoute } from '@/openapi/team/createTeam';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const createTeamController: RouteController<CreateTeamRoute> = async (c) => {
  const { name, color } = await c.req.valid('json');
  const teamId = await createTeam(name, color);
  if (!teamId.success)
    switch (teamId.error) {
      case HttpStatusCodes.CONFLICT:
        return httpErrorResponse(c, teamId.error, 'Team name is already taken');
      default:
        return httpErrorResponse(c, teamId.error);
    }
  return httpSuccessResponse(c, teamId.data);
};

export default createTeamController;
