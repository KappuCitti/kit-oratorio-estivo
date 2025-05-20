import { HttpStatusCodes } from '@/codes';
import { deleteTeam } from '@/database/team/deleteTeam';
import { editTeam } from '@/database/team/editTeam';
import type { RouteController } from '@/models/app.model';
import type { EditTeamRoute } from '@/openapi/team/editTeam';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const editTeamController: RouteController<EditTeamRoute> = async (c) => {
  const { id } = await c.req.valid('param');
  const { name, color } = await c.req.valid('json');
  const res = await editTeam(id, name, color);
  if (!res.success) {
    switch (res.error) {
      case HttpStatusCodes.NOT_FOUND:
        return httpErrorResponse(
          c,
          HttpStatusCodes.NOT_FOUND,
          'Team not found'
        );
      case HttpStatusCodes.CONFLICT:
        return httpErrorResponse(
          c,
          HttpStatusCodes.CONFLICT,
          'Team already exists'
        );
      default:
        return httpErrorResponse(c, res.error);
    }
  }
  return httpSuccessResponse(c, null);
};

export default editTeamController;
