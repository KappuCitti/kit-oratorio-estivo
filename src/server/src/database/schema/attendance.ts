import {
  boolean,
  date,
  int,
  mysqlTable,
  unique,
} from 'drizzle-orm/mysql-core';
import { enrollmentTable } from './enrollment';

export const attendanceTable = mysqlTable(
  'attendances',
  {
    id: int().primaryKey().autoincrement().notNull(),
    enrollmentId: int()
      .notNull()
      .references(() => enrollmentTable.id, { onDelete: 'cascade' }),
    date: date({ mode: 'string' }).notNull(),
    eatsInOratory: boolean().notNull().default(false),
  },
  // Una presenza per iscritto per giorno. Il controller non fa alcun controllo
  // di duplicazione: senza questo vincolo bastava premere due volte il pulsante
  // per contare due volte lo stesso ragazzo.
  // E' anche l'indice che serve alla ricerca presenze, che filtra per data.
  (table) => [
    unique('attendances_enrollment_id_date_unique').on(
      table.enrollmentId,
      table.date
    ),
  ]
);
