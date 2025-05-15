import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const activityTable = mysqlTable('activities', {
  id: int().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  place: varchar({ length: 255 }),
});
