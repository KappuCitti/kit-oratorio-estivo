import { getEnrollmentQueueList } from '@/database/enrollment/getEnrollmentQueueList';
import type { RouteController } from '@/models/app.model';
import type { GetEnrollmentQueueListRoute } from '@/openapi/enrollment/getEnrollmentQueues';
import { httpSuccessResponse } from '@/utils/responses';

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
  return httpSuccessResponse(c, enrollments);
};

export default getEnrollmentQueuesController;
