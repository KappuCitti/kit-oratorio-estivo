import { int, mysqlTable } from 'drizzle-orm/mysql-core';
import { eventsTable } from './events';
import { classTable } from './class';
import { schoolTable } from './school';

export const eventClassesTable = mysqlTable('event_classes', {
  eventId: int()
    .references(() => eventsTable.id, { onDelete: 'cascade' })
    .notNull(),
  classId: int()
    .notNull()
    .references(() => classTable.id, {
      onDelete: 'cascade',
    }),
  schoolId: int()
    .notNull()
    .references(() => schoolTable.id, {
      onDelete: 'cascade',
    }),
});
