import {
  date,
  int,
  mysqlEnum,
  mysqlTable,
  varchar,
} from 'drizzle-orm/mysql-core';
import { addressTable } from './address';
import { usersTable } from './user';

export const personalInfoTable = mysqlTable('personal_info', {
  id: varchar({ length: 16 })
    .primaryKey()
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  name: varchar({ length: 100 }).notNull(),
  surname: varchar({ length: 100 }).notNull(),
  gender: mysqlEnum(['M', 'F']),
  // Era varchar(100): il database accettava qualunque stringa come data di
  // nascita e ogni chiamante rifaceva la validazione a modo suo. `mode: 'string'`
  // tiene il tipo TypeScript a `string` in formato YYYY-MM-DD, quindi il
  // contratto dell'API non cambia, ma il vincolo lo impone il database.
  birthDate: date({ mode: 'string' }),
  birthPlace: varchar({ length: 255 }),
  addressId: int().references(() => addressTable.id),
});
