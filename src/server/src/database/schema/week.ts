import {
  boolean,
  date,
  decimal,
  int,
  mysqlTable,
} from 'drizzle-orm/mysql-core';

export const weekTable = mysqlTable('weeks', {
  id: int().primaryKey().autoincrement().notNull(),
  startDate: date().notNull(),
  endDate: date().notNull(),
  price: decimal({ precision: 10, scale: 2 }).notNull(),
  maxEnrollments: int({ unsigned: true }).notNull(),
  registrationOpenDate: date().notNull(),
  registrationCloseDate: date().notNull(),
  /**
   * Cosa succede quando la settimana ha esaurito i posti.
   *
   * false: le nuove richieste vengono rifiutate.
   * true: vengono accettate in coda, il genitore e' avvisato che potrebbero
   * non essere confermate, e i responsabili vedono che la settimana e' oltre
   * il limite quando le esaminano.
   */
  allowOverbooking: boolean().notNull().default(false),
});
