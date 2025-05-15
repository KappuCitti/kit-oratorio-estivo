import { date, decimal, int, mysqlTable } from 'drizzle-orm/mysql-core';

export const weekTable = mysqlTable('weeks', {
  id: int().primaryKey().autoincrement().notNull(),
  startDate: date().notNull(),
  endDate: date().notNull(),
  price: decimal({ precision: 10, scale: 2 }).notNull(),
  maxEnrollments: int({ unsigned: true }).notNull(),
  registrationOpenDate: date().notNull(),
  registrationCloseDate: date().notNull(),
});
