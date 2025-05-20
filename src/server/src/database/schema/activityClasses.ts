import { int, mysqlTable } from 'drizzle-orm/mysql-core';
import { activityTable } from './activities';
import { classTable } from './class';

export const activityClassesTable = mysqlTable('activity_classes', {
  activityId: int()
    .references(() => activityTable.id, { onDelete: 'cascade' })
    .notNull(),
  classId: int()
    .notNull()
    .references(() => classTable.id, {
      onDelete: 'cascade',
    }),
});
