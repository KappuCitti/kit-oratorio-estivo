import { getAttendanceList } from '@/database/attendance/getAttendanceList';
import type { RouteController } from '@/models/app.model';
import type { GetAttendanceListRoute } from '@/openapi/attendances/getAttendances';
import { httpSuccessResponse } from '@/utils/responses';

const getAttendancesController: RouteController<
  GetAttendanceListRoute
> = async (c) => {
  const { date } = await c.req.valid('query');
  const attendances = await getAttendanceList(date);
  return httpSuccessResponse(c, attendances);
};

export default getAttendancesController;
