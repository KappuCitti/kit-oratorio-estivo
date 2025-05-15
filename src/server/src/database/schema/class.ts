import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { schoolTable } from './school';

export const classTable = mysqlTable('classes', {
  id: int().primaryKey().autoincrement().notNull(),
  name: varchar({ length: 50 }).notNull(),
  schoolId: int()
    .notNull()
    .references(() => schoolTable.id, {
      onDelete: 'cascade',
    }),
});
