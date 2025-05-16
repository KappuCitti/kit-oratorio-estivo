import addActivityController from '@/controllers/activity/addActivity';
import getActivitiesController from '@/controllers/activity/getActivityList';
import type { HonoApp } from '@/models/app.model';
import { addActivityRouteDef } from '@/openapi/activity/addActivity';
import { getActivityListRouteDef } from '@/openapi/activity/getActivities';

export default (router: HonoApp) => {
  router.openapi(getActivityListRouteDef, getActivitiesController);
  router.openapi(addActivityRouteDef, addActivityController);
};
