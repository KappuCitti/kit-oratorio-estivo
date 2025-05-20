import { HttpStatusCodes } from '@/codes';
import { createSchool } from '@/database/school/createSchool';
import type { RouteController } from '@/models/app.model';
import type { CreateSchoolRoute } from '@/openapi/school/createSchool';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const createSchoolController: RouteController<CreateSchoolRoute> = async (
  c
) => {
  const { name, canChooseActivities } = await c.req.valid('json');
  const res = await createSchool(name, canChooseActivities);
  if (!res.success) {
    switch (res.error) {
      case HttpStatusCodes.CONFLICT:
        return httpErrorResponse(
          c,
          HttpStatusCodes.CONFLICT,
          'School already exists'
        );
      case HttpStatusCodes.INTERNAL_SERVER_ERROR:
        return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  return httpSuccessResponse(c, res.data);
};

export default createSchoolController;
