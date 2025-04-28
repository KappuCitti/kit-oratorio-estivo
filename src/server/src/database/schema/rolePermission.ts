import { int, mysqlTable, primaryKey } from 'drizzle-orm/mysql-core';
import { roleTable } from './role';
import { permissionTable } from './permission';

export const rolePermissionTable = mysqlTable(
  'role_permissions',
  {
    roleId: int()
      .notNull()
      .references(() => roleTable.id, { onDelete: 'cascade' }),
    permissionId: int()
      .notNull()
      .references(() => permissionTable.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.roleId, table.permissionId] })]
);
