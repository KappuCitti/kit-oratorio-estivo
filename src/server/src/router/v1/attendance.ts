import getAttendancesController from '@/controllers/attendance/getAttendanceList';
import type { HonoApp } from '@/models/app.model';
import { getAttendanceListRouteDef } from '@/openapi/attendances/getAttendances';

export default (router: HonoApp) => {
  router.openapi(getAttendanceListRouteDef, getAttendancesController);
};
