import { HttpStatusCodes } from '@/codes';
import { getAttendances } from '@/database/attendance/getAttendances';
import type { RouteController } from '@/models/app.model';
import type { GetAttendaceListRoute } from '@/openapi/attendance/getAttendances';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const getAttendancesController: RouteController<GetAttendaceListRoute> = async (
  c
) => {
  const { page, size, date, className, schoolType, teamId } = await c.req.valid(
    'query'
  );
  const attendances = await getAttendances(
    date,
    page,
    size,
    teamId,
    className,
    schoolType
  );
  if (!attendances.success)
    return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  return httpSuccessResponse(c, attendances.data);
};

export default getAttendancesController;
