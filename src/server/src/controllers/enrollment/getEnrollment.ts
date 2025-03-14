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
  if (!enrollment.success) {
    switch (enrollment.error) {
      case HttpStatusCodes.NOT_FOUND:
        return httpErrorResponse(
          c,
          HttpStatusCodes.NOT_FOUND,
          'Enrollment not found'
        );
      default:
        return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  return httpSuccessResponse(c, enrollment.data);
};

export default getEnrollmentController;
