import { editAttendance } from '@/database/attendance/editAttendance';
import type { RouteController } from '@/models/app.model';
import type { EditAttendanceRoute } from '@/openapi/attendances/editAttendance';
import { httpSuccessResponse } from '@/utils/responses';

const editAttendanceController: RouteController<EditAttendanceRoute> = async (
  c
) => {
  const { id } = await c.req.valid('param');
  const { date, eatsInOratory } = await c.req.valid('json');
  await editAttendance(id, date, eatsInOratory);
  return httpSuccessResponse(c, null);
};

export default editAttendanceController;
