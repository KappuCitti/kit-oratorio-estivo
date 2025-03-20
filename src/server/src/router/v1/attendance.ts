import getAttendancesController from '@/controllers/attendance/getAttendanceList';
import type { HonoApp } from '@/models/app.model';
import { getAttendaceListRouteDef } from '@/openapi/attendance/getAttendances';

export default (router: HonoApp) => {
  router.openapi(getAttendaceListRouteDef, getAttendancesController);
};
