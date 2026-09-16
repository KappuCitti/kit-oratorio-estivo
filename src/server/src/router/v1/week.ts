import createWeekController from '@/controllers/week/createWeek';
import getWeeksController from '@/controllers/week/getWeekList';
import { createWeekRouteDef } from '@/openapi/week/createWeek';
import { getWeekListRouteDef } from '@/openapi/week/getWeeks';
import { createRouter } from '@/utils/createRouter';

export default createRouter()
  .openapi(getWeekListRouteDef, getWeeksController)
  .openapi(createWeekRouteDef, createWeekController);
