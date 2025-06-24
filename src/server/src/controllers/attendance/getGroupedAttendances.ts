import { getGroupedAttendances } from '@/database/attendance/getGroupedAttendances';
import type { RouteController } from '@/models/app.model';
import type { GetGroupedAttendancesRoute } from '@/openapi/attendances/getGroupedAttendances';
import { httpSuccessResponse } from '@/utils/responses';

const getGroupedAttendancesController: RouteController<
  GetGroupedAttendancesRoute
> = async (c) => {
  const { date } = await c.req.valid('query');
  const attendances = await getGroupedAttendances(date);
  return httpSuccessResponse(c, attendances);
};

export default getGroupedAttendancesController;
