import { createSchool } from '@/database/school/createSchool';
import type { RouteController } from '@/models/app.model';
import type { CreateSchoolRoute } from '@/openapi/school/createSchool';
import { httpSuccessResponse } from '@/utils/responses';

const createSchoolController: RouteController<CreateSchoolRoute> = async (
  c
) => {
  const { name, canChooseActivities } = await c.req.valid('json');
  const schoolId = await createSchool(name, canChooseActivities);
  return httpSuccessResponse(c, schoolId);
};

export default createSchoolController;
