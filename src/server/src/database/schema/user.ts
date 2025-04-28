import { THEMES } from '@/models/theme.model';
import { int, mysqlEnum, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const usersTable = mysqlTable('users', {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 100 }).notNull(),
  surname: varchar({ length: 100 }).notNull(),
  email: varchar({ length: 255 }),
  theme: mysqlEnum(THEMES).notNull().default('System'),
  password: varchar({ length: 255 }).notNull(),
});
