import { getSchools } from '@/database/school/getSchools';
import type { RouteController } from '@/models/app.model';
import type { GetSchoolListRoute } from '@/openapi/school/getSchools';
import { httpSuccessResponse } from '@/utils/responses';

const getSchoolsController: RouteController<GetSchoolListRoute> = async (c) => {
  const { query } = await c.req.valid('query');
  const schools = await getSchools(query);
  return httpSuccessResponse(c, schools);
};

export default getSchoolsController;
