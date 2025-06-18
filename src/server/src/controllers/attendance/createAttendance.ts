import { createAttendance } from '@/database/attendance/createAttendance';
import type { RouteController } from '@/models/app.model';
import type { CreateAttendanceRoute } from '@/openapi/attendances/createAttendance';
import { httpSuccessResponse } from '@/utils/responses';

const createAttendanceController: RouteController<
  CreateAttendanceRoute
> = async (c) => {
  const { date, eatsInOratory, userId } = await c.req.valid('json');
  const attendanceId = await createAttendance(userId, date, eatsInOratory);
  return httpSuccessResponse(c, attendanceId);
};

export default createAttendanceController;
