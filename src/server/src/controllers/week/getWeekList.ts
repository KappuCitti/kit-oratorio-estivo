import { getWeeks } from '@/database/week/getWeeks';
import type { RouteController } from '@/models/app.model';
import type { GetWeekListRoute } from '@/openapi/week/getWeeks';
import { httpSuccessResponse } from '@/utils/responses';

const getWeeksController: RouteController<GetWeekListRoute> = async (c) => {
  const { year } = await c.req.valid('query');
  const weeks = await getWeeks(year);
  return httpSuccessResponse(c, weeks);
};

export default getWeeksController;
