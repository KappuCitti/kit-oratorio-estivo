import { boolean, int, mysqlTable, primaryKey } from 'drizzle-orm/mysql-core';
import { enrollmentTable, tripTable } from '../schema';

export const tripEnrollmentTable = mysqlTable(
  'trip_enrollments',
  {
    enrollmentId: int()
      .notNull()
      .references(() => enrollmentTable.id, {
        onDelete: 'cascade',
      }),
    tripId: int().references(() => tripTable.id, {
      onDelete: 'cascade',
    }),
    isPaid: boolean().notNull().default(false),
  },
  (table) => [primaryKey({ columns: [table.enrollmentId, table.tripId] })]
);
