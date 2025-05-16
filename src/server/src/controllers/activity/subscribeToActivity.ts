import { HttpStatusCodes } from '@/codes';
import { subscribeToActivity } from '@/database/activity/subscribeToActivity';
import type { RouteController } from '@/models/app.model';
import type { SubscribeToActivityRoute } from '@/openapi/activity/subscribeToActivity';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';
import { getCookie } from 'hono/cookie';

const subscribeToActivityController: RouteController<
  SubscribeToActivityRoute
> = async (c) => {
  const { userId, weekId } = c.req.valid('json');
  const { activityId } = c.req.valid('param');
  const token = getCookie(c, 'user_token') as string;
  const response = await subscribeToActivity(token, userId, activityId, weekId);
  if (!response.success) {
    switch (response.error) {
      case HttpStatusCodes.BAD_REQUEST:
        return httpErrorResponse(
          c,
          HttpStatusCodes.BAD_REQUEST,
          'User cannot join activity'
        );
      case HttpStatusCodes.FORBIDDEN:
        return httpErrorResponse(
          c,
          HttpStatusCodes.FORBIDDEN,
          'Invalid user or missing permissions'
        );
      default:
        return httpErrorResponse(c, response.error);
    }
  }
  return httpSuccessResponse(c, response.data);
};

export default subscribeToActivityController;
