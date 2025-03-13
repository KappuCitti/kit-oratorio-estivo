import { HttpStatusCodes } from '@/codes';
import { editTeam } from '@/database/team/editTeam';
import type { RouteController } from '@/models/app.model';
import type { EditTeamRoute } from '@/openapi/team/editTeam';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const editTeamController: RouteController<EditTeamRoute> = async (c) => {
  const { name, color, child } = await c.req.valid('json');
  const { id } = await c.req.valid('param');
  const res = await editTeam(id, name, color, child);
  if (!res.success)
    switch (res.error) {
      case HttpStatusCodes.CONFLICT:
        return httpErrorResponse(c, res.error, 'Team name is already taken');
      case HttpStatusCodes.BAD_REQUEST:
        return httpErrorResponse(
          c,
          res.error,
          'One or more child ids are invalid'
        );
      case HttpStatusCodes.NOT_FOUND:
        return httpErrorResponse(c, res.error, 'Team not found');
      default:
        return httpErrorResponse(c, res.error);
    }
  return httpSuccessResponse(c, null);
};

export default editTeamController;
