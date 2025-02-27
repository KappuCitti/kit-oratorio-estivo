import { HttpStatusCodes } from '@/codes';
import { getWeeks } from '@/database/week/getWeeks';
import type { RouteController } from '@/models/app.model';
import type { GetWeekListRoute } from '@/openapi/week/getWeeks';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const getWeeksController: RouteController<GetWeekListRoute> = async (c) => {
  const { year } = await c.req.valid('query');
  const weeks = await getWeeks(year);
  if (!weeks.success)
    return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  return httpSuccessResponse(c, weeks.data);
};

export default getWeeksController;
