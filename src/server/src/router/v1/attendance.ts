import createAttendanceController from '@/controllers/attendance/createAttendance';
import deleteAttendanceController from '@/controllers/attendance/deleteAttendance';
import editAttendanceController from '@/controllers/attendance/editAttendance';
import getAttendancesController from '@/controllers/attendance/getAttendanceList';
import type { HonoApp } from '@/models/app.model';
import { createAttendanceRouteDef } from '@/openapi/attendances/createAttendance';
import { deleteAttendanceRouteDef } from '@/openapi/attendances/deleteAttendance';
import { editAttendanceRouteDef } from '@/openapi/attendances/editAttendance';
import { getAttendanceListRouteDef } from '@/openapi/attendances/getAttendances';

export default (router: HonoApp) => {
  router.openapi(getAttendanceListRouteDef, getAttendancesController);
  router.openapi(deleteAttendanceRouteDef, deleteAttendanceController);
  router.openapi(editAttendanceRouteDef, editAttendanceController);
  router.openapi(createAttendanceRouteDef, createAttendanceController);
};
