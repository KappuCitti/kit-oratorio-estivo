import {
  boolean,
  datetime,
  int,
  mysqlTable,
  text,
  varchar,
} from 'drizzle-orm/mysql-core';
import { shirtSizeTable } from './shirt';
import { usersTable } from './user';
import { schoolTable } from './school';
import { classTable } from './class';

export const enrollmentQueueTable = mysqlTable('enrollment_queue', {
  id: int().primaryKey().autoincrement().notNull(),
  userId: varchar({ length: 16 })
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  shirtSizeId: int().references(() => shirtSizeTable.id, {
    onDelete: 'set null',
  }),
  dataProcessingConsent: boolean().notNull().default(true),
  imageProcessingConsent: boolean().notNull().default(false),
  exitAuthorization: boolean().notNull().default(true),
  classId: int()
    .notNull()
    .references(() => classTable.id, {
      onDelete: 'cascade',
    }),
  year: int().notNull(),
  dateOfEnrollment: datetime().notNull(),
  parentNotes: text(),
  specialDiet: text(),
});
