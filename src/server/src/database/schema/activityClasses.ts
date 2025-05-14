import { int, mysqlEnum, mysqlTable } from 'drizzle-orm/mysql-core';
import { CLASSES } from '@/models/class.model';
import { SCHOOL_TYPES } from '@/models/schoolTypes.model';
import { activityTable } from './activities';

export const activityClassesTable = mysqlTable('activity_classes', {
  activityId: int()
    .references(() => activityTable.id, { onDelete: 'cascade' })
    .notNull(),
  class: mysqlEnum(CLASSES),
  schoolType: mysqlEnum(SCHOOL_TYPES),
});
