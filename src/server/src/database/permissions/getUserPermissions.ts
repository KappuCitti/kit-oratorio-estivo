import { eq } from 'drizzle-orm';
import { db } from '..';
import { rolePermissionTable } from '../schema/rolePermission';
import { usersTable } from '../schema/user';

export async function getUserPermissions(userId: string) {
  const permissions = await db
    .select({
      permission: rolePermissionTable.permission,
    })
    .from(rolePermissionTable)
    .innerJoin(usersTable, eq(rolePermissionTable.roleId, usersTable.roleId))
    .where(eq(usersTable.id, userId));
  return permissions.map((p) => p.permission);
}
