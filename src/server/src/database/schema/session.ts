import { datetime, index, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { usersTable } from './user';

export const sessionTable = mysqlTable(
  'sessions',
  {
    token: varchar({ length: 36 })
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    // Era un DATE: la scadenza veniva troncata al giorno, quindi una sessione
    // creata alle 23:50 restava valida fino a mezzanotte del giorno di scadenza
    // invece che all'ora esatta. Serve la precisione al secondo.
    expires: datetime().notNull(),
    userId: varchar({ length: 16 })
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
  },
  // La pulizia delle sessioni scadute filtra per `expires`: senza indice e' una
  // scansione completa della tabella.
  (table) => [index('sessions_expires_idx').on(table.expires)]
);
