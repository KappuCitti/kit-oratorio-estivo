import { getEnrollment } from '@/database/enrollment/getEnrollment';
import type { RouteController } from '@/models/app.model';
import type { GetEnrollmentInfoRoute } from '@/openapi/enrollment/getEnrollment';
import { httpSuccessResponse } from '@/utils/responses';

const getEnrollmentController: RouteController<GetEnrollmentInfoRoute> = async (
  c
) => {
  const { id } = await c.req.valid('param');
  const enrollment = await getEnrollment(id);
  return httpSuccessResponse(c, enrollment);
};

export default getEnrollmentController;
