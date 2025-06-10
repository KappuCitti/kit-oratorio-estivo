import { createTeam } from '@/database/team/createTeam';
import type { RouteController } from '@/models/app.model';
import type { CreateTeamRoute } from '@/openapi/team/createTeam';
import { httpSuccessResponse } from '@/utils/responses';

const createTeamController: RouteController<CreateTeamRoute> = async (c) => {
  const { name, color } = await c.req.valid('json');
  const teamId = await createTeam(name, color);
  return httpSuccessResponse(c, teamId);
};

export default createTeamController;
