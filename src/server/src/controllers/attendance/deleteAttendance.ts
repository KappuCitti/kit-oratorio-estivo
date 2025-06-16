import { deleteAttendance } from '@/database/attendance/deleteAttendance';
import type { RouteController } from '@/models/app.model';
import type { DeleteAttendanceRoute } from '@/openapi/attendances/deleteAttendance';
import { httpSuccessResponse } from '@/utils/responses';

const deleteAttendanceController: RouteController<
  DeleteAttendanceRoute
> = async (c) => {
  const { id } = await c.req.valid('param');
  await deleteAttendance(id);
  return httpSuccessResponse(c, null);
};

export default deleteAttendanceController;
