import { int, mysqlTable, primaryKey } from 'drizzle-orm/mysql-core';
import { usersTable } from './user';
import { roleTable } from './role';

export const userRoleTable = mysqlTable(
  'user_roles',
  {
    userId: int().references(() => usersTable.id, {
      onDelete: 'cascade',
    }),
    roleId: int()
      .notNull()
      .references(() => roleTable.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.userId, table.roleId] })]
);
