import { createEnrollmentAsAdmin } from '@/database/enrollment/createEnrollmentAsAdmin';
import type { RouteController } from '@/models/app.model';
import type { CreateEnrollmentAsAdminRoute } from '@/openapi/enrollment/createEnrollmentAsAdmin';
import { httpSuccessResponse } from '@/utils/responses';

const createEnrollmentAsAdminController: RouteController<
  CreateEnrollmentAsAdminRoute
> = async (c) => {
  const data = await c.req.valid('json');
  const id = await createEnrollmentAsAdmin(data);
  return httpSuccessResponse(c, id);
};

export default createEnrollmentAsAdminController;
