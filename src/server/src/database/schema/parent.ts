import { GENDERS } from '@/models/gender.model';
import { int, mysqlEnum, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const parentTable = mysqlTable('parents', {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 255 }).notNull(),
  surname: varchar({ length: 255 }).notNull(),
  gender: mysqlEnum(GENDERS).notNull(),
  email: varchar({ length: 255 }),
  phoneNumber: varchar({ length: 20 }).notNull(),
});
