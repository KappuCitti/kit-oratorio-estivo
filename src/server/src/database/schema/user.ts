import { THEMES } from '@/models/theme.model';
import { int, mysqlEnum, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { roleTable } from './role';

export const usersTable = mysqlTable('users', {
  id: varchar({ length: 16 }).primaryKey().notNull(),
  email: varchar({ length: 255 }),
  password: varchar({ length: 255 }).notNull(),
  theme: mysqlEnum(THEMES).notNull().default('System'),
  roleId: int()
    .notNull()
    .references(() => roleTable.id),
});
