import { int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';

export const roleTable = mysqlTable('roles', {
  id: int().primaryKey().autoincrement().notNull(),
  name: varchar({ length: 50 }).notNull().unique(),
  description: text(),
});
