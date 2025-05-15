import getActivitiesController from '@/controllers/activity/getActivityList';
import type { HonoApp } from '@/models/app.model';
import { getActivityListRouteDef } from '@/openapi/activity/getActivities';

export default (router: HonoApp) => {
  router.openapi(getActivityListRouteDef, getActivitiesController);
};
