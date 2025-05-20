import { HttpStatusCodes } from '@/codes';
import { getSchools } from '@/database/school/getSchools';
import type { RouteController } from '@/models/app.model';
import type { GetSchoolListRoute } from '@/openapi/school/getSchools';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const getSchoolsController: RouteController<GetSchoolListRoute> = async (c) => {
  const { query } = await c.req.valid('query');
  const schools = await getSchools(query);
  if (!schools.success)
    return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  return httpSuccessResponse(c, schools.data);
};

export default getSchoolsController;
