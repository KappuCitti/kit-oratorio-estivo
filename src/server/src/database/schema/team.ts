import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const teamTable = mysqlTable('teams', {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 40 }).notNull(),
  color: varchar({ length: 7 }).notNull(),
});
