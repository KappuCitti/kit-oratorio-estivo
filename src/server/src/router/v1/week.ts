import createWeekController from '@/controllers/week/createWeek';
import editWeekController from '@/controllers/week/editWeek';
import getWeeksController from '@/controllers/week/getWeekList';
import { createWeekRouteDef } from '@/openapi/week/createWeek';
import { editWeekRouteDef } from '@/openapi/week/editWeek';
import { getWeekListRouteDef } from '@/openapi/week/getWeeks';
import { createRouter } from '@/utils/createRouter';

export default createRouter()
  .openapi(getWeekListRouteDef, getWeeksController)
  .openapi(createWeekRouteDef, createWeekController)
  .openapi(editWeekRouteDef, editWeekController);
