import { boolean, int, mysqlTable, primaryKey } from 'drizzle-orm/mysql-core';
import { enrollmentTable } from './enrollment';
import { weekTable } from './week';

export const enrollmentWeeksTable = mysqlTable(
  'enrollment_weeks',
  {
    enrollmentId: int()
      .notNull()
      .references(() => enrollmentTable.id, { onDelete: 'cascade' }),
    weekId: int()
      .notNull()
      .references(() => weekTable.id, { onDelete: 'cascade' }),
    isPaid: boolean().notNull().default(false),
  },
  (table) => [primaryKey({ columns: [table.enrollmentId, table.weekId] })]
);
