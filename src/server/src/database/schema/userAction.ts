import {
  date,
  int,
  mysqlEnum,
  mysqlTable,
  varchar,
} from 'drizzle-orm/mysql-core';
import { usersTable } from './user';

export const userActionTable = mysqlTable('user_actions', {
  id: int().primaryKey().autoincrement(),
  userId: int().references(() => usersTable.id, {
    onDelete: 'set null',
  }),
  description: varchar({ length: 255 }).notNull(),
  type: mysqlEnum(['CREATE', 'UPDATE', 'DELETE']).notNull(),
  date: date().notNull(),
});
