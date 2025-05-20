import createWeekController from '@/controllers/week/createWeek';
import getWeeksController from '@/controllers/week/getWeekList';
import type { HonoApp } from '@/models/app.model';
import { createWeekRouteDef } from '@/openapi/week/createWeek';
import { getWeekListRouteDef } from '@/openapi/week/getWeeks';

export default (router: HonoApp) => {
  router.openapi(getWeekListRouteDef, getWeeksController);
  router.openapi(createWeekRouteDef, createWeekController);
};
