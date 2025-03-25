import { HttpStatusCodes } from '@/codes';
import { deleteAttedance } from '@/database/attendance/deleteAttendance';
import type { RouteController } from '@/models/app.model';
import type { DeleteAttendanceRoute } from '@/openapi/attendance/deleteAttendance';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const deleteAttendanceController: RouteController<
  DeleteAttendanceRoute
> = async (c) => {
  const { id } = await c.req.valid('param');
  const res = await deleteAttedance(id);
  if (!res.success) {
    switch (res.error) {
      case HttpStatusCodes.NOT_FOUND:
        return httpErrorResponse(c, res.error, 'Attendance not found');
      default:
        return httpErrorResponse(c, res.error);
    }
  }
  return httpSuccessResponse(c, res.data);
};

export default deleteAttendanceController;
