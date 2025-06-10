import { getEnrollmentList } from '@/database/enrollment/getEnrollmentList';
import type { RouteController } from '@/models/app.model';
import type { GetEnrollmentListRoute } from '@/openapi/enrollment/getEnrollments';
import { httpSuccessResponse } from '@/utils/responses';

const getEnrollmentsController: RouteController<
  GetEnrollmentListRoute
> = async (c) => {
  const { page, size, schoolId, classId, query, weekId, teamId, year } =
    await c.req.valid('query');
  const enrollments = await getEnrollmentList(
    page,
    size,
    year,
    weekId,
    teamId,
    query,
    schoolId,
    classId
  );
  return httpSuccessResponse(c, enrollments);
};

export default getEnrollmentsController;
