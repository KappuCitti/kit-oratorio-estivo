import { editTeam } from '@/database/team/editTeam';
import type { RouteController } from '@/models/app.model';
import type { EditTeamRoute } from '@/openapi/team/editTeam';
import { httpSuccessResponse } from '@/utils/responses';

const editTeamController: RouteController<EditTeamRoute> = async (c) => {
  const { id } = await c.req.valid('param');
  const { name, color } = await c.req.valid('json');
  await editTeam(id, name, color);
  return httpSuccessResponse(c, null);
};

export default editTeamController;
