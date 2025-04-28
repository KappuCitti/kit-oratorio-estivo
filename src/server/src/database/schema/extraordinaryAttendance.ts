import {
  datetime,
  int,
  mysqlEnum,
  mysqlTable,
  varchar,
} from 'drizzle-orm/mysql-core';
import { usersTable } from './user';

export const extraordinaryAttendanceTable = mysqlTable(
  'extraordinary_attendances',
  {
    id: int().primaryKey().autoincrement(),
    userId: varchar({ length: 16 })
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    type: mysqlEnum(['Join', 'Left']).notNull(),
    time: datetime().notNull(),
    notes: varchar({ length: 255 }).notNull().default(''),
  }
);
