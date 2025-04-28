import { GENDERS } from '@/models/gender.model';
import { int, mysqlEnum, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { addressTable } from './address';

export const childTable = mysqlTable('childrens', {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 255 }).notNull(),
  surname: varchar({ length: 255 }).notNull(),
  gender: mysqlEnum(GENDERS).notNull(),
  birthDate: varchar({ length: 255 }).notNull(),
  birthPlace: varchar({ length: 255 }).notNull(),
  addressId: int()
    .notNull()
    .references(() => addressTable.id),
});
