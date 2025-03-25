import { HttpStatusCodes } from '@/codes';
import { createAttendance } from '@/database/attendance/createAttendance';
import type { RouteController } from '@/models/app.model';
import type { CreateAttendanceRoute } from '@/openapi/attendance/createAttendance';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const createAttendanceController: RouteController<
  CreateAttendanceRoute
> = async (c) => {
  const { enrollmentId, date, present, eatsInOratory, eatsPlain } =
    await c.req.valid('json');
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
  const attendance = await createAttendance(
    enrollmentId,
    new Date(date),
    present,
    eatsInOratory,
    eatsPlain
  );
  if (!attendance.success) {
    switch (attendance.error) {
      case HttpStatusCodes.CONFLICT:
        return httpErrorResponse(
          c,
          attendance.error,
          'There is already one attendance in the selected date with the specified enrollment id'
        );
      case HttpStatusCodes.BAD_REQUEST:
        return httpErrorResponse(
          c,
          attendance.error,
          'Enrollment is invalid or does not include the selected date'
        );
      default:
        return httpErrorResponse(c, attendance.error);
    }
  }
  return httpSuccessResponse(c, attendance.data);
};

export default createAttendanceController;
