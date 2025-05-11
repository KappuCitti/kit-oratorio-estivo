import config from '@/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { createPool } from 'mysql2/promise';
import { addressTable } from './schema/address';
import { attendanceTable } from './schema/attendance';
import { enrollmentTable } from './schema/enrollment';
import { enrollmentWeeksTable } from './schema/enrollmentWeek';
import { extraordinaryAttendanceTable } from './schema/extraordinaryAttendance';
import { managesTable } from './schema/manages';
import { roleTable } from './schema/role';
import { rolePermissionTable } from './schema/rolePermission';
import { sessionTable } from './schema/session';
import { shirtSizeTable } from './schema/shirt';
import { teamTable } from './schema/team';
import { tripTable } from './schema/trip';
import { usersTable } from './schema/user';
import { userTripTable } from './schema/userTrip';
import { weekTable } from './schema/week';

const client = createPool(config.database);

const schema = {
  addresses: addressTable,
  attendances: attendanceTable,
  enrollments: enrollmentTable,
  enrollmentWeeks: enrollmentWeeksTable,
  extraordinaryAttendances: extraordinaryAttendanceTable,
  manages: managesTable,
  roles: roleTable,
  rolePermissions: rolePermissionTable,
  sessions: sessionTable,
  shirts: shirtSizeTable,
  teams: teamTable,
  trips: tripTable,
  users: usersTable,
  userTrips: userTripTable,
  weeks: weekTable,
};

export const db = drizzle(client, {
  schema,
  mode: 'default',
  casing: 'snake_case',
});
