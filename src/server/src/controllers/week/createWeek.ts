import { HttpStatusCodes } from '@/codes';
import { createWeek } from '@/database/week/createWeek';
import type { RouteController } from '@/models/app.model';
import type { CreateWeekRoute } from '@/openapi/week/createWeek';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const createWeekController: RouteController<CreateWeekRoute> = async (c) => {
  const {
    startDate,
    endDate,
    price,
    maxEnrollments,
    registrationOpenDate,
    registrationCloseDate,
  } = await c.req.valid('json');
  const res = await createWeek(
    startDate,
    endDate,
    price,
    maxEnrollments,
    registrationOpenDate,
    registrationCloseDate
  );
  if (!res.success) {
    switch (res.error) {
      case HttpStatusCodes.CONFLICT:
        return httpErrorResponse(
          c,
          HttpStatusCodes.CONFLICT,
          'Week in that period already exists'
        );
      default:
        return httpErrorResponse(c, res.error);
    }
  }
  return httpSuccessResponse(c, res.data);
};

export default createWeekController;
