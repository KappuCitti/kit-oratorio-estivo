import { getActivities } from '@/database/activity/getActivities';
import type { RouteController } from '@/models/app.model';
import type { GetActivityListRoute } from '@/openapi/activity/getActivities';
import { httpSuccessResponse } from '@/utils/responses';

const getActivitiesController: RouteController<GetActivityListRoute> = async (
  c
) => {
  const { page, size, schoolId, classId, query } = await c.req.valid('query');
  const activity = await getActivities(page, size, query, schoolId, classId);
  return httpSuccessResponse(c, activity);
};

export default getActivitiesController;
