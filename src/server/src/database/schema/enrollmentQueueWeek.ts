import { int, mysqlTable, primaryKey } from 'drizzle-orm/mysql-core';
import { weekTable } from './week';
import { enrollmentQueueTable } from './enrollmentQueue';

export const enrollmentQueueWeeksTable = mysqlTable(
  'enrollment_queue_weeks',
  {
    enrollmentId: int()
      .notNull()
      .references(() => enrollmentQueueTable.id, { onDelete: 'cascade' }),
    weekId: int()
      .notNull()
      .references(() => weekTable.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.enrollmentId, table.weekId] })]
);
