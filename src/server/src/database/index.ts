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
import { eventsTable } from './schema/events';
import { usersTable } from './schema/user';
import { userEventTable } from './schema/userEvents';
import { weekTable } from './schema/week';
import { eventClassesTable } from './schema/eventClasses';
import { schoolTable } from './schema/school';
import { classTable } from './schema/class';
import { enrollmentQueueTable } from './schema/enrollmentQueue';
import { enrollmentQueueWeeksTable } from './schema/enrollmentQueueWeek';
import { activityTable } from './schema/activities';
import { activityAppointmentTable } from './schema/activityAppointments';
import { activitySubscriptionTable } from './schema/activitySubscriptions';

const client = createPool(config.database);

export const schema = {
  activities: activityTable,
  activityAppointments: activityAppointmentTable,
  activitySubscriptions: activitySubscriptionTable,
  addresses: addressTable,
  attendances: attendanceTable,
  classes: classTable,
  enrollments: enrollmentTable,
  enrollmentQueue: enrollmentQueueTable,
  enrollmentQueueWeeks: enrollmentQueueWeeksTable,
  enrollmentWeeks: enrollmentWeeksTable,
  events: eventsTable,
  eventClasses: eventClassesTable,
  extraordinaryAttendances: extraordinaryAttendanceTable,
  manages: managesTable,
  roles: roleTable,
  rolePermissions: rolePermissionTable,
  schools: schoolTable,
  sessions: sessionTable,
  shirts: shirtSizeTable,
  teams: teamTable,
  users: usersTable,
  userEvents: userEventTable,
  weeks: weekTable,
};

export const db = drizzle(client, {
  schema,
  mode: 'default',
  casing: 'snake_case',
});
