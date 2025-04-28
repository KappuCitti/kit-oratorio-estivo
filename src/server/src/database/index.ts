import config from '@/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { createPool } from 'mysql2/promise';
import { addressTable } from './schema/address';
import { attendanceTable } from './schema/attendance';
import { enrollmentTable } from './schema/enrollment';
import { enrollmentWeeksTable } from './schema/enrollmentWeek';
import { extraordinaryAttendanceTable } from './schema/extraordinaryAttendance';
import { manageTable } from './schema/manage';
import { permissionTable } from './schema/permission';
import { roleTable } from './schema/role';
import { rolePermissionTable } from './schema/rolePermission';
import { sessionTable } from './schema/session';
import { shirtSizeTable } from './schema/shirt';
import { teamTable } from './schema/team';
import { tripTable } from './schema/trip';
import { usersTable } from './schema/user';
import { userRoleTable } from './schema/userRole';
import { userTripTable } from './schema/userTrip';
import { weekTable } from './schema/week';

const client = createPool(config.database);

const schema = {
  address: addressTable,
  attendance: attendanceTable,
  enrollment: enrollmentTable,
  enrollmentWeeks: enrollmentWeeksTable,
  extraordinaryAttendance: extraordinaryAttendanceTable,
  manage: manageTable,
  permission: permissionTable,
  role: roleTable,
  rolePermissions: rolePermissionTable,
  session: sessionTable,
  shirt: shirtSizeTable,
  team: teamTable,
  trip: tripTable,
  user: usersTable,
  userRoles: userRoleTable,
  userTrip: userTripTable,
  week: weekTable,
};

export const db = drizzle(client, {
  schema,
  mode: 'default',
  casing: 'snake_case',
});
