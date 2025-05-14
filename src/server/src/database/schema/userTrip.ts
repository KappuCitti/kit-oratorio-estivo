import {
  boolean,
  int,
  mysqlTable,
  primaryKey,
  varchar,
} from 'drizzle-orm/mysql-core';
import { usersTable } from './user';
import { activityTable } from './activities';

export const userTripTable = mysqlTable(
  'user_trips',
  {
    userId: varchar({ length: 16 })
      .notNull()
      .references(() => usersTable.id, {
        onDelete: 'cascade',
      }),
    tripId: int().references(() => activityTable.id, {
      onDelete: 'cascade',
    }),
    isPaid: boolean().notNull().default(false),
  },
  (table) => [primaryKey({ columns: [table.userId, table.tripId] })]
);
