import createAttendanceController from '@/controllers/attendance/createAttendance';
import getAttendancesController from '@/controllers/attendance/getAttendanceList';
import type { HonoApp } from '@/models/app.model';
import { createAttendanceRouteDef } from '@/openapi/attendance/createAttendance';
import { getAttendaceListRouteDef } from '@/openapi/attendance/getAttendances';

export default (router: HonoApp) => {
  router.openapi(getAttendaceListRouteDef, getAttendancesController);
  router.openapi(createAttendanceRouteDef, createAttendanceController);
};
