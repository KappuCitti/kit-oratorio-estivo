import { subscribeToActivity } from '@/database/activity/subscribeToActivity';
import type { RouteController } from '@/models/app.model';
import type { SubscribeToActivityRoute } from '@/openapi/activity/subscribeToActivity';
import { httpSuccessResponse } from '@/utils/responses';
import { getCookie } from 'hono/cookie';

const subscribeToActivityController: RouteController<
  SubscribeToActivityRoute
> = async (c) => {
  const { userId, weekId } = c.req.valid('json');
  const { activityId } = c.req.valid('param');
  const token = getCookie(c, 'user_token') as string;
  await subscribeToActivity(token, userId, activityId, weekId);
  return httpSuccessResponse(c, null);
};

export default subscribeToActivityController;
