import { eq, inArray } from 'drizzle-orm';
import { db } from '..';
import { permissionTable, rolePermissionTable, userRoleTable } from '../schema';
import { createSuccessResult, createErrorResult } from '@/utils/createResult';
import { HttpStatusCodes } from '@/codes';
import { dbLogger } from '../logger';

export async function getUserPermissions(userId: number) {
  try {
    const roleIds = (
      await db.query.userRoleTable.findMany({
        where: eq(userRoleTable.userId, userId),
        columns: { roleId: true },
      })
    ).map((r) => r.roleId);
    const permissionIds: number[] = [];
    for (const roleId of roleIds) {
      const rolePermissions = await db.query.rolePermissionTable.findMany({
        where: eq(rolePermissionTable.roleId, roleId),
        columns: { permissionId: true },
      });
      permissionIds.push(...rolePermissions.map((p) => p.permissionId));
    }
    const permissions = await db.query.permissionTable.findMany({
      where: inArray(permissionTable.id, permissionIds),
      columns: { description: false },
    });
    return createSuccessResult(permissions);
  } catch (error) {
    dbLogger.error(error);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
