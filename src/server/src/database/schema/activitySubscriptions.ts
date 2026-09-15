import { int, mysqlTable, primaryKey } from 'drizzle-orm/mysql-core';
import { activityTable } from './activities';
import { weekTable } from './week';
import { enrollmentTable } from './enrollment';

export const activitySubscriptionTable = mysqlTable(
  'activity_subscriptions',
  {
    activityId: int()
      .notNull()
      .references(() => activityTable.id),
    weekId: int()
      .notNull()
      .references(() => weekTable.id),
    enrollmentId: int()
      .notNull()
      .references(() => enrollmentTable.id),
  },
  // Il controller di iscrizione a un'attivita' non controlla i duplicati:
  // senza PK lo stesso ragazzo poteva iscriversi N volte alla stessa attivita'
  // nella stessa settimana.
  (table) => [
    primaryKey({
      columns: [table.activityId, table.weekId, table.enrollmentId],
    }),
  ]
);
