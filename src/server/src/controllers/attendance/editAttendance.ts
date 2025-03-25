import { HttpStatusCodes } from '@/codes';
import { createAttendance } from '@/database/attendance/createAttendance';
import { editAttendance } from '@/database/attendance/editAttendance';
import type { RouteController } from '@/models/app.model';
import type { EditAttendanceRoute } from '@/openapi/attendance/editAttendance';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const editAttendanceController: RouteController<EditAttendanceRoute> = async (
  c
) => {
  const { enrollmentId, date, present, eatsInOratory, eatsPlain } =
    await c.req.valid('json');
  const { id } = await c.req.valid('param');
  if (!present && eatsInOratory)
    return httpErrorResponse(
      c,
      HttpStatusCodes.BAD_REQUEST,
      'Child cannot eat in the oratory if he is not present'
    );
  if (!eatsInOratory && eatsPlain)
    return httpErrorResponse(
      c,
      HttpStatusCodes.BAD_REQUEST,
      "Cannot enable 'eatsPlain' if 'eatsInOratory' is disabled"
    );
  const attendance = await editAttendance(
    id,
    enrollmentId,
    date,
    present,
    eatsInOratory,
    eatsPlain
  );
  if (!attendance.success) {
    switch (attendance.error) {
      case HttpStatusCodes.BAD_REQUEST:
        return httpErrorResponse(
          c,
          attendance.error,
          'Enrollment is invalid or does not include the selected date'
        );
      case HttpStatusCodes.NOT_FOUND:
        return httpErrorResponse(c, attendance.error, 'Attendance not found');
      case HttpStatusCodes.CONFLICT:
        return httpErrorResponse(
          c,
          attendance.error,
          'There is already one attendance in the selected date with the specified enrollment id'
        );
      default:
        return httpErrorResponse(c, attendance.error);
    }
  }
  return httpSuccessResponse(c, attendance.data);
};

export default editAttendanceController;
