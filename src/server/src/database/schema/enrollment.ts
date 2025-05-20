import {
  boolean,
  char,
  datetime,
  int,
  mysqlTable,
  text,
  varchar,
} from 'drizzle-orm/mysql-core';
import { teamTable } from './team';
import { shirtSizeTable } from './shirt';
import { usersTable } from './user';
import { schoolTable } from './school';
import { classTable } from './class';

export const enrollmentTable = mysqlTable('enrollments', {
  id: int().primaryKey().autoincrement().notNull(),
  userId: varchar({ length: 16 })
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  teamId: int().references(() => teamTable.id, {
    onDelete: 'set null',
  }),
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
  section: char().notNull(),
  year: int().notNull(),
  dateOfEnrollment: datetime().notNull(),
  parentNotes: text(),
  managerNotes: text(),
  specialDiet: text(),
});
