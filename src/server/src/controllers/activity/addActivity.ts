import { HttpStatusCodes } from '@/codes';
import { addActivity } from '@/database/activity/addActivity';
import type { RouteController } from '@/models/app.model';
import type { AddActivityRoute } from '@/openapi/activity/addActivity';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const addActivityController: RouteController<AddActivityRoute> = async (c) => {
  const { name, place, weeks } = await c.req.valid('json');
  const activity = await addActivity(name, weeks, place);
  if (!activity.success) {
    switch (activity.error) {
      case HttpStatusCodes.BAD_REQUEST:
        return httpErrorResponse(
          c,
          HttpStatusCodes.BAD_REQUEST,
          'One or more weeks are invalid'
        );
      case HttpStatusCodes.CONFLICT:
        return httpErrorResponse(
          c,
          HttpStatusCodes.CONFLICT,
          'Activity name is already taken'
        );
      default:
        return httpErrorResponse(c, activity.error);
    }
  }
  return httpSuccessResponse(c, activity.data);
};

export default addActivityController;
