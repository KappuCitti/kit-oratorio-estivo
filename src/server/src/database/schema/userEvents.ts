import {
  boolean,
  int,
  mysqlTable,
  primaryKey,
  varchar,
} from 'drizzle-orm/mysql-core';
import { usersTable } from './user';
import { eventsTable } from './events';

export const userEventTable = mysqlTable(
  'user_events',
  {
    userId: varchar({ length: 16 })
      .notNull()
      .references(() => usersTable.id, {
        onDelete: 'cascade',
      }),
    eventId: int().references(() => eventsTable.id, {
      onDelete: 'cascade',
    }),
    isPaid: boolean().notNull().default(false),
  },
  (table) => [primaryKey({ columns: [table.userId, table.eventId] })]
);
