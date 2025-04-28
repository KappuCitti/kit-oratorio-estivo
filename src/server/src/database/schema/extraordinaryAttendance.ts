import {
  datetime,
  int,
  mysqlEnum,
  mysqlTable,
  varchar,
} from 'drizzle-orm/mysql-core';
import { childTable } from './child';

export const extraordinaryAttendanceTable = mysqlTable(
  'extraordinary_attendances',
  {
    id: int().primaryKey().autoincrement(),
    childId: int()
      .notNull()
      .references(() => childTable.id, { onDelete: 'cascade' }),
    type: mysqlEnum(['Join', 'Left']).notNull(),
    time: datetime().notNull(),
    notes: varchar({ length: 255 }).notNull().default(''),
  }
);
