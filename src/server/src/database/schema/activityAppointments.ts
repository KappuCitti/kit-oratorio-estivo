import { int, mysqlTable, primaryKey, time } from 'drizzle-orm/mysql-core';
import { activityTable } from './activities';
import { weekTable } from './week';

export const activityAppointmentTable = mysqlTable(
  'activity_appointments',
  {
    activityId: int()
      .notNull()
      .references(() => activityTable.id),
    weekId: int()
      .notNull()
      .references(() => weekTable.id),
    startTime: time().notNull(),
    endTime: time().notNull(),
  },
  (table) => [primaryKey({ columns: [table.activityId, table.weekId] })]
);
