import { int, mysqlEnum, mysqlTable, primaryKey } from 'drizzle-orm/mysql-core';
import { roleTable } from './role';
import { PERMISSIONS } from '@/models/permissions.model';

export const rolePermissionTable = mysqlTable(
  'role_permissions',
  {
    roleId: int()
      .notNull()
      .references(() => roleTable.id, { onDelete: 'cascade' }),
    permission: mysqlEnum(PERMISSIONS).notNull(),
  },
  // Senza PK la stessa coppia (ruolo, permesso) poteva essere inserita piu'
  // volte, e la tabella non aveva nessun indice utile alle join dei middleware.
  (table) => [primaryKey({ columns: [table.roleId, table.permission] })]
);
