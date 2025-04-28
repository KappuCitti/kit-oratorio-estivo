import { THEMES } from '@/models/theme.model';
import { mysqlEnum, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const usersTable = mysqlTable('users', {
  id: varchar({ length: 16 }).primaryKey().notNull(),
  email: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  theme: mysqlEnum(THEMES).notNull().default('System'),
});
