import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const addressTable = mysqlTable('addresses', {
  id: int().primaryKey().autoincrement(),
  street: varchar({ length: 255 }).notNull(),
  city: varchar({ length: 255 }).notNull(),
  postalCode: varchar({ length: 20 }).notNull(),
  country: varchar({ length: 100 }).notNull(),
});
