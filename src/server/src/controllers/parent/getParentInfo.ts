import { HttpStatusCodes } from '@/codes';
import { getParent } from '@/database/parent/getParent';
import type { RouteController } from '@/models/app.model';
import type { GetParentInfoRoute } from '@/openapi/parent/getParent';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const getParentController: RouteController<GetParentInfoRoute> = async (c) => {
  const { id } = await c.req.valid('param');
  const parent = await getParent(id);
  if (!parent.success) {
    switch (parent.error) {
      case HttpStatusCodes.NOT_FOUND:
        return httpErrorResponse(
          c,
          HttpStatusCodes.NOT_FOUND,
          'Parent not found'
        );
      default:
        return httpErrorResponse(c, parent.error);
    }
  }
  return httpSuccessResponse(c, parent.data);
};

export default getParentController;
