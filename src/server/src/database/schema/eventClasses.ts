import { int, mysqlEnum, mysqlTable } from 'drizzle-orm/mysql-core';
import { eventsTable } from './events';
import { CLASSES } from '@/models/class.model';
import { SCHOOL_TYPES } from '@/models/schoolTypes.model';

export const eventClassesTable = mysqlTable('event_classes', {
  eventId: int()
    .references(() => eventsTable.id, { onDelete: 'cascade' })
    .notNull(),
  class: mysqlEnum(CLASSES),
  schoolType: mysqlEnum(SCHOOL_TYPES),
});
