import createAttendanceController from '@/controllers/attendance/createAttendance';
import deleteAttendanceController from '@/controllers/attendance/deleteAttendance';
import editAttendanceController from '@/controllers/attendance/editAttendance';
import getAttendancesController from '@/controllers/attendance/getAttendanceList';
import getGroupedAttendancesController from '@/controllers/attendance/getGroupedAttendances';
import { createAttendanceRouteDef } from '@/openapi/attendances/createAttendance';
import { deleteAttendanceRouteDef } from '@/openapi/attendances/deleteAttendance';
import { editAttendanceRouteDef } from '@/openapi/attendances/editAttendance';
import { getAttendanceListRouteDef } from '@/openapi/attendances/getAttendances';
import { getGroupedAttendancesRouteDef } from '@/openapi/attendances/getGroupedAttendances';
import { createRouter } from '@/utils/createRouter';

export default createRouter()
  .openapi(getGroupedAttendancesRouteDef, getGroupedAttendancesController)
  .openapi(getAttendanceListRouteDef, getAttendancesController)
  .openapi(deleteAttendanceRouteDef, deleteAttendanceController)
  .openapi(editAttendanceRouteDef, editAttendanceController)
  .openapi(createAttendanceRouteDef, createAttendanceController);
