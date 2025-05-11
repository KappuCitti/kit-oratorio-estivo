import { int, mysqlEnum, mysqlTable } from 'drizzle-orm/mysql-core';
import { roleTable } from './role';
import { PERMISSIONS } from '@/models/permissions.model';

export const rolePermissionTable = mysqlTable('role_permissions', {
  roleId: int()
    .notNull()
    .references(() => roleTable.id, { onDelete: 'cascade' }),
  permission: mysqlEnum(PERMISSIONS).notNull(),
});
