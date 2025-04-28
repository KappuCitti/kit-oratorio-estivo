import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { addressTable } from '../schema';

export const personalInfoTable = mysqlTable('personal_info', {
  id: varchar({ length: 16 }).primaryKey().notNull(),
  name: varchar({ length: 100 }).notNull(),
  surname: varchar({ length: 100 }).notNull(),
  birthDate: varchar({ length: 100 }).notNull(),
  birthPlace: varchar({ length: 255 }),
  addressId: int()
    .notNull()
    .references(() => addressTable.id),
});
