import { int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';

export const permissionTable = mysqlTable('permissions', {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 100 }).notNull().unique(),
  description: text(),
});
