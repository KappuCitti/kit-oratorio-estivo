import { HttpStatusCodes } from '@/codes';
import { getClasses } from '@/database/class/getClasses';
import type { RouteController } from '@/models/app.model';
import type { GetClassListRoute } from '@/openapi/class/getClasses';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const getClassesController: RouteController<GetClassListRoute> = async (c) => {
  const { schoolId } = await c.req.valid('query');
  const classes = await getClasses(schoolId);
  if (!classes.success)
    return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  return httpSuccessResponse(c, classes.data);
};

export default getClassesController;
