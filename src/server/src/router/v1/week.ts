import getWeeksController from '@/controllers/week/getWeekList';
import type { HonoApp } from '@/models/app.model';
import { getWeekListRouteDef } from '@/openapi/week/getWeeks';

export default (router: HonoApp) => {
  router.openapi(getWeekListRouteDef, getWeeksController);
};
