import { eq } from 'drizzle-orm';
import { db } from '..';
import { createSuccessResult, createErrorResult } from '@/utils/createResult';
import { HttpStatusCodes } from '@/codes';
import { dbLogger } from '../logger';
import { rolePermissionTable } from '../schema/rolePermission';
import { usersTable } from '../schema/user';

export async function getUserPermissions(userId: string) {
  try {
    const permissions = await db
      .select({
        permission: rolePermissionTable.permission,
      })
      .from(rolePermissionTable)
      .innerJoin(usersTable, eq(rolePermissionTable.roleId, usersTable.roleId))
      .where(eq(usersTable.id, userId));
    return createSuccessResult(permissions.map((p) => p.permission));
  } catch (error) {
    dbLogger.error(error);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
