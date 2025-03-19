import { HttpStatusCodes } from '@/codes';
import { deleteParent } from '@/database/parent/deleteParent';
import type { RouteController } from '@/models/app.model';
import type { DeleteParentRoute } from '@/openapi/parent/deleteParent';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const deleteParentController: RouteController<DeleteParentRoute> = async (
  c
) => {
  const { id } = await c.req.valid('param');
  const deleted = await deleteParent(id);
  if (!deleted.success) {
    switch (deleted.error) {
      case HttpStatusCodes.NOT_FOUND:
        return httpErrorResponse(
          c,
          HttpStatusCodes.NOT_FOUND,
          'Parent not found'
        );
      default:
        return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  return httpSuccessResponse(c, null);
};

export default deleteParentController;
