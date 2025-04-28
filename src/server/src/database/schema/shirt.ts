import {
  boolean,
  decimal,
  int,
  mysqlTable,
  varchar,
} from 'drizzle-orm/mysql-core';

export const shirtSizeTable = mysqlTable('shirts', {
  id: int().primaryKey().autoincrement(),
  sizeName: varchar({ length: 50 }).notNull(),
  width: decimal({ precision: 5, scale: 2 }).notNull(),
  height: decimal({ precision: 5, scale: 2 }).notNull(),
  isAvailable: boolean().notNull().default(true),
});
