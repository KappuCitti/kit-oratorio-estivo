import { HttpStatusCodes } from '@/codes';
import { getEnrollmentList } from '@/database/enrollment/getEnrollmentList';
import type { RouteController } from '@/models/app.model';
import type { GetEnrollmentListRoute } from '@/openapi/enrollment/getEnrollments';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const getEnrollmentsController: RouteController<
  GetEnrollmentListRoute
> = async (c) => {
  const { page, size } = await c.req.valid('query');
  const enrollments = await getEnrollmentList(page, size);
  if (!enrollments.success)
    return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  return httpSuccessResponse(c, enrollments.data);
};

export default getEnrollmentsController;
