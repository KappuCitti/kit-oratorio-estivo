import { boolean, date, int, mysqlTable } from 'drizzle-orm/mysql-core';
import { enrollmentTable } from '../schema';

export const attendanceTable = mysqlTable('attendances', {
  id: int().primaryKey().autoincrement(),
  enrollmentId: int()
    .notNull()
    .references(() => enrollmentTable.id, { onDelete: 'cascade' }),
  date: date().notNull(),
  present: boolean().notNull().default(false),
  eatsInOratory: boolean().notNull().default(false),
});
