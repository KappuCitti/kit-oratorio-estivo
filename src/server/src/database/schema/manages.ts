import { mysqlTable, primaryKey, varchar } from 'drizzle-orm/mysql-core';
import { usersTable } from './user';

/**
 * Chi puo' gestire chi: tipicamente un genitore e i propri figli.
 *
 * Le colonne erano `varchar(36)` senza alcuna foreign key, mentre `users.id` e'
 * un `varchar(16)` (codice fiscale). Risultato: larghezze disallineate e nessuna
 * garanzia che le righe puntassero a utenti esistenti, su una tabella che decide
 * chi puo' vedere i dati di quale minore.
 */
export const managesTable = mysqlTable(
  'manages',
  {
    mainId: varchar({ length: 16 })
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    targetId: varchar({ length: 16 })
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.mainId, table.targetId] })]
);
