import {
  date,
  index,
  int,
  mysqlTable,
  varchar,
} from 'drizzle-orm/mysql-core';
import { teamTable } from './team';
import { usersTable } from './user';

/**
 * Punteggi assegnati alle squadre: e' la base della classifica.
 *
 * Modellata sulla tabella `Point` della v1, che alimentava le pagine
 * leaderboard poi perse nella riscrittura v2. Differenze rispetto alla v1:
 * `userId` punta al codice fiscale (varchar(16)) invece che a un intero, e
 * ci sono indici su (squadra, data) perche' la classifica si legge sempre
 * aggregando per squadra su un intervallo di date.
 */
export const pointTable = mysqlTable(
  'points',
  {
    id: int().primaryKey().autoincrement().notNull(),
    teamId: int()
      .notNull()
      .references(() => teamTable.id, { onDelete: 'cascade' }),
    date: date({ mode: 'string' }).notNull(),
    // Con segno: le penalita' si registrano come quantita' negative.
    quantity: int().notNull(),
    reason: varchar({ length: 255 }),
    // Chi ha assegnato il punteggio. Resta null se l'utente viene cancellato,
    // cosi' lo storico della classifica non si buca.
    userId: varchar({ length: 16 }).references(() => usersTable.id, {
      onDelete: 'set null',
    }),
  },
  (table) => [
    index('points_team_date_idx').on(table.teamId, table.date),
    index('points_date_idx').on(table.date),
  ]
);
