import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '../logger';
import { HttpStatusCodes } from '@/codes';
import { db } from '..';
import { rolePermissionTable } from '../schema/rolePermission';
import { and, eq } from 'drizzle-orm';
import { usersTable } from '../schema/user';
import type { Permission } from '@/models/permissions.model';

export async function hasPermission(userId: string, permission: Permission) {
  try {
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
    return createSuccessResult(permissions.length > 0);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
