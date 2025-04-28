import {
  boolean,
  char,
  datetime,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  varchar,
} from 'drizzle-orm/mysql-core';
import { teamTable } from './team';
import { shirtSizeTable } from './shirt';
import { SCHOOL_TYPES } from '@/models/schoolTypes.model';
import { CLASSES } from '@/models/class.model';
import { usersTable } from './user';

export const enrollmentTable = mysqlTable('enrollments', {
  id: int().primaryKey().autoincrement(),
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
  schoolType: mysqlEnum(SCHOOL_TYPES).notNull(),
  className: mysqlEnum(CLASSES).notNull(),
  section: char().notNull(),
  year: int().notNull(),
  dateOfEnrollment: datetime().notNull(),
  parentNotes: text(),
  managerNotes: text(),
  specialDiet: text(),
});
