import deleteAttendanceController from '@/controllers/attendance/deleteAttendance';
import getAttendancesController from '@/controllers/attendance/getAttendanceList';
import type { HonoApp } from '@/models/app.model';
import { deleteAttendanceRouteDef } from '@/openapi/attendances/deleteAttendance';
import { getAttendanceListRouteDef } from '@/openapi/attendances/getAttendances';

export default (router: HonoApp) => {
  router.openapi(getAttendanceListRouteDef, getAttendancesController);
  router.openapi(deleteAttendanceRouteDef, deleteAttendanceController);
};
