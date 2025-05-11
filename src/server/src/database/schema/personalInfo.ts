import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { addressTable } from './address';
import { usersTable } from './user';

export const personalInfoTable = mysqlTable('personal_info', {
  id: varchar({ length: 16 })
    .primaryKey()
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  name: varchar({ length: 100 }).notNull(),
  surname: varchar({ length: 100 }).notNull(),
  birthDate: varchar({ length: 100 }),
  birthPlace: varchar({ length: 255 }),
  addressId: int().references(() => addressTable.id),
});
