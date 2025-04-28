import { mysqlTable, int, varchar, date } from 'drizzle-orm/mysql-core';
import { teamTable } from './team';
import { usersTable } from './user';

export const pointTable = mysqlTable('Point', {
  id: int().primaryKey().autoincrement(),
  teamId: int()
    .notNull()
    .references(() => teamTable.id, { onDelete: 'cascade' }),
  date: date().notNull(),
  quantity: int().notNull(),
  reason: varchar({ length: 255 }),
  userId: int().references(() => usersTable.id, {
    onDelete: 'set null',
  }),
});
