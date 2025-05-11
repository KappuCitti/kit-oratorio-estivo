import { boolean, date, int, mysqlTable } from 'drizzle-orm/mysql-core';
import { enrollmentTable } from './enrollment';

export const attendanceTable = mysqlTable('attendances', {
  id: int().primaryKey().autoincrement().notNull(),
  enrollmentId: int()
    .notNull()
    .references(() => enrollmentTable.id, { onDelete: 'cascade' }),
  date: date().notNull(),
  present: boolean().notNull().default(false),
  eatsInOratory: boolean().notNull().default(false),
});
