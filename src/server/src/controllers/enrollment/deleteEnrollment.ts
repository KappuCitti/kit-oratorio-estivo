import { HttpStatusCodes } from '@/codes';
import { deleteEnrollment } from '@/database/enrollment/deleteEnrollment';
import type { RouteController } from '@/models/app.model';
import type { DeleteEnrollmentRoute } from '@/openapi/enrollment/deleteEnrollment';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const deleteEnrollmentController: RouteController<
  DeleteEnrollmentRoute
> = async (c) => {
  const { id } = await c.req.valid('param');
  const res = await deleteEnrollment(id);
  if (!res.success) {
    switch (res.error) {
      case HttpStatusCodes.NOT_FOUND:
        return httpErrorResponse(c, res.error, 'Enrollment not found');
      default:
        return httpErrorResponse(c, res.error);
    }
  }
  return httpSuccessResponse(c, null);
};

export default deleteEnrollmentController;
