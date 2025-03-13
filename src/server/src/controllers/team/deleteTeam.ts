import { HttpStatusCodes } from '@/codes';
import { deleteTeam } from '@/database/team/deleteTeam';
import type { RouteController } from '@/models/app.model';
import type { DeleteTeamRoute } from '@/openapi/team/deleteTeam';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const deleteTeamController: RouteController<DeleteTeamRoute> = async (c) => {
  const { id } = await c.req.valid('param');
  const res = await deleteTeam(id);
  if (!res.success) {
    switch (res.error) {
      case HttpStatusCodes.NOT_FOUND:
        return httpErrorResponse(
          c,
          HttpStatusCodes.NOT_FOUND,
          'Team not found'
        );
      default:
        return httpErrorResponse(c, res.error);
    }
  }
  return httpSuccessResponse(c, null);
};

export default deleteTeamController;
