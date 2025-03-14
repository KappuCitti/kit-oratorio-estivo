import { HttpStatusCodes } from '@/codes';
import { getChildren } from '@/database/children/getChildren';
import type { RouteController } from '@/models/app.model';
import type { GetChildInfoRoute } from '@/openapi/children/getChildren';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const getChildrenController: RouteController<GetChildInfoRoute> = async (c) => {
  const { id } = await c.req.valid('param');
  const childInfo = await getChildren(id);
  if (!childInfo.success) {
    switch (childInfo.error) {
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
  return httpSuccessResponse(c, childInfo.data);
};

export default getChildrenController;
