import { createWeek } from '@/database/week/createWeek';
import type { RouteController } from '@/models/app.model';
import type { CreateWeekRoute } from '@/openapi/week/createWeek';
import { httpSuccessResponse } from '@/utils/responses';

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
  return httpSuccessResponse(c, res);
};

export default createWeekController;
