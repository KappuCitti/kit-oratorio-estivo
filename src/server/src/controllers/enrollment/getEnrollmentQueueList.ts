import { HttpStatusCodes } from '@/codes';
import { getEnrollmentList } from '@/database/enrollment/getEnrollmentList';
import { getEnrollmentQueueList } from '@/database/enrollment/getEnrollmentQueueList';
import type { RouteController } from '@/models/app.model';
import type { GetEnrollmentQueueListRoute } from '@/openapi/enrollment/getEnrollmentQueues';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const getEnrollmentQueuesController: RouteController<
  GetEnrollmentQueueListRoute
> = async (c) => {
  const { page, size, schoolId, classId, query, weekId, year } =
    await c.req.valid('query');
  const enrollments = await getEnrollmentQueueList(
    page,
    size,
    year,
    weekId,
    query,
    schoolId,
    classId
  );
  if (!enrollments.success)
    return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  return httpSuccessResponse(c, enrollments.data);
};

export default getEnrollmentQueuesController;
