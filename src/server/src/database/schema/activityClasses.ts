import { int, mysqlTable, primaryKey } from 'drizzle-orm/mysql-core';
import { activityTable } from './activities';
import { classTable } from './class';

/**
 * Quali classi possono partecipare a quale attivita'.
 *
 * Attenzione: nessun endpoint popola ancora questa tabella, e `getActivities`
 * ci fa sopra un innerJoin — per questo `GET /activities` restituisce sempre una
 * lista vuota. Il join va sistemato, oppure va aggiunto un endpoint che scriva
 * qui, prima che le attivita' possano funzionare.
 */
export const activityClassesTable = mysqlTable(
  'activity_classes',
  {
    activityId: int()
      .references(() => activityTable.id, { onDelete: 'cascade' })
      .notNull(),
    classId: int()
      .notNull()
      .references(() => classTable.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => [primaryKey({ columns: [table.activityId, table.classId] })]
);
