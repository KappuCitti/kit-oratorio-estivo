import { HttpStatusCodes } from '@/codes';
import { getParents } from '@/database/parent/getParents';
import type { RouteController } from '@/models/app.model';
import type { GetParentListRoute } from '@/openapi/parent/getParents';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const getParentsController: RouteController<GetParentListRoute> = async (c) => {
  const { page, size, query, gender, child } = await c.req.valid('query');
  const enrollments = await getParents(page, size, query, gender, child);
  if (!enrollments.success)
    return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  return httpSuccessResponse(c, enrollments.data);
};

export default getParentsController;
