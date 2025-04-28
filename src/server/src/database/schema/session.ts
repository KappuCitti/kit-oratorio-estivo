import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { usersTable } from './user';

export const sessionTable = mysqlTable('sessions', {
  token: varchar({ length: 36 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  expires: varchar({ length: 255 }).notNull(),
  userId: int()
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
});
