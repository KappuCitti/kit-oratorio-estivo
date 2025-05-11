import {
  date,
  decimal,
  int,
  mysqlTable,
  text,
  varchar,
} from 'drizzle-orm/mysql-core';

export const tripTable = mysqlTable('trips', {
  id: int().primaryKey().autoincrement().notNull(),
  title: varchar({ length: 255 }).notNull(),
  description: text(),
  place: varchar({ length: 255 }).notNull(),
  url: text(),
  date: date().notNull(),
  price: decimal({ precision: 10, scale: 2 }).notNull().default('0'),
});
