import { deleteTeam } from '@/database/team/deleteTeam';
import type { RouteController } from '@/models/app.model';
import type { DeleteTeamRoute } from '@/openapi/team/deleteTeam';
import { httpSuccessResponse } from '@/utils/responses';

const deleteTeamController: RouteController<DeleteTeamRoute> = async (c) => {
  const { id } = await c.req.valid('param');
  await deleteTeam(id);
  return httpSuccessResponse(c, null);
};

export default deleteTeamController;
