import { HttpStatusCodes } from '@/codes';
import { deleteChild } from '@/database/children/deleteChildren';
import type { RouteController } from '@/models/app.model';
import type { DeleteChildRoute } from '@/openapi/children/deleteChildren';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const deleteChildrenController: RouteController<DeleteChildRoute> = async (
  c
) => {
  const { id } = await c.req.valid('param');
  const deleted = await deleteChild(id);
  if (!deleted.success) {
    switch (deleted.error) {
      case HttpStatusCodes.NOT_FOUND:
        return httpErrorResponse(
          c,
          HttpStatusCodes.NOT_FOUND,
          'Child not found'
        );
      default:
        return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  return httpSuccessResponse(c, null);
};

export default deleteChildrenController;
