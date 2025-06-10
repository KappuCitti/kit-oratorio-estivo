import { addActivity } from '@/database/activity/addActivity';
import type { RouteController } from '@/models/app.model';
import type { AddActivityRoute } from '@/openapi/activity/addActivity';
import { httpSuccessResponse } from '@/utils/responses';

const addActivityController: RouteController<AddActivityRoute> = async (c) => {
  const { name, place, weeks } = await c.req.valid('json');
  const activity = await addActivity(name, weeks, place);
  return httpSuccessResponse(c, activity);
};

export default addActivityController;
