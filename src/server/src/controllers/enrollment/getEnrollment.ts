import { HttpStatusCodes } from '@/codes';
import { getEnrollment } from '@/database/enrollment/getEnrollment';
import type { RouteController } from '@/models/app.model';
import type { GetEnrollmentInfoRoute } from '@/openapi/enrollment/getEnrollment';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const getEnrollmentController: RouteController<GetEnrollmentInfoRoute> = async (
  c
) => {
  const { id } = await c.req.valid('param');
  const enrollment = await getEnrollment(id);
  if (!enrollment.success)
    return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  if (!enrollment.data)
    return httpErrorResponse(
      c,
      HttpStatusCodes.NOT_FOUND,
      'Enrollment not found'
    );
  return httpSuccessResponse(c, enrollment.data);
};

export default getEnrollmentController;
