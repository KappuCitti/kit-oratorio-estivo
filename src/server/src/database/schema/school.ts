import { boolean, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const schoolTable = mysqlTable('schools', {
  id: int().primaryKey().autoincrement().notNull(),
  name: varchar({ length: 100 }).notNull(),
  canChooseActivities: boolean().notNull(),
});
