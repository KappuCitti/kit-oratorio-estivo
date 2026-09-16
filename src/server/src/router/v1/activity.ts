import addActivityController from '@/controllers/activity/addActivity';
import getActivitiesController from '@/controllers/activity/getActivityList';
import { addActivityRouteDef } from '@/openapi/activity/addActivity';
import { getActivityListRouteDef } from '@/openapi/activity/getActivities';
import { createRouter } from '@/utils/createRouter';

export default createRouter()
  .openapi(getActivityListRouteDef, getActivitiesController)
  .openapi(addActivityRouteDef, addActivityController);
