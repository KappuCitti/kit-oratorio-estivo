import { HttpStatusCodes } from '@/codes';
import { getActivities } from '@/database/activity/getActivities';
import type { RouteController } from '@/models/app.model';
import type { GetActivityListRoute } from '@/openapi/activity/getActivities';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const getActivitiesController: RouteController<GetActivityListRoute> = async (
  c
) => {
  const { page, size, schoolId, classId, query } = await c.req.valid('query');
  const activity = await getActivities(page, size, query, schoolId, classId);
  if (!activity.success)
    return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  return httpSuccessResponse(c, activity.data);
};

export default getActivitiesController;
