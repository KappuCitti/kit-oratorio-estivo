import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '../logger';
import { HttpStatusCodes } from '@/codes';
import { db } from '..';
import { rolePermissionTable } from '../schema/rolePermission';
import { roleTable } from '../schema/role';
import { eq } from 'drizzle-orm';

export async function getRoleIdIfCanRegister(role: string) {
  try {
    const rolePermissions = await db
      .select({
        roleId: roleTable.id,
        permissions: rolePermissionTable.permission,
      })
      .from(rolePermissionTable)
      .innerJoin(roleTable, eq(rolePermissionTable.roleId, roleTable.id))
      .where(eq(roleTable.name, role));
    const permissions = rolePermissions.map((r) => r.permissions);

    return createSuccessResult(
      permissions.includes('register') ? rolePermissions[0].roleId : null
    );
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
