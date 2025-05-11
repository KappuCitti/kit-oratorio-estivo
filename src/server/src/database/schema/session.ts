import { date, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { usersTable } from './user';

export const sessionTable = mysqlTable('sessions', {
  token: varchar({ length: 36 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  expires: date().notNull(),
  userId: varchar({ length: 16 })
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
});
