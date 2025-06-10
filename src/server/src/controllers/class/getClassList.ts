import { getClasses } from '@/database/class/getClasses';
import type { RouteController } from '@/models/app.model';
import type { GetClassListRoute } from '@/openapi/class/getClasses';
import { httpSuccessResponse } from '@/utils/responses';

const getClassesController: RouteController<GetClassListRoute> = async (c) => {
  const { schoolId } = await c.req.valid('query');
  const classes = await getClasses(schoolId);
  return httpSuccessResponse(c, classes);
};

export default getClassesController;
