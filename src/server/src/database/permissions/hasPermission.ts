import { db } from '..';
import { rolePermissionTable } from '../schema/rolePermission';
import { and, eq } from 'drizzle-orm';
import { usersTable } from '../schema/user';
import type { Permission } from '@/models/permissions.model';

export async function hasPermission(userId: string, permission: Permission) {
  const permissions = await db
    .select()
    .from(rolePermissionTable)
    .innerJoin(usersTable, eq(rolePermissionTable.roleId, usersTable.roleId))
    .where(
      and(
        eq(usersTable.id, userId),
        eq(rolePermissionTable.permission, permission)
      )
    );
  return permissions.length > 0;
}
