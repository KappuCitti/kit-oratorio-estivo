import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { db } from '..';
import { eq, inArray } from 'drizzle-orm';
import { roleTable, userRoleTable } from '../schema';
import { HttpStatusCodes } from '@/codes';

export async function getUserRoles(userId: number) {
  try {
    const roleIds = (
      await db.query.userRoleTable.findMany({
        where: eq(userRoleTable.userId, userId),
        columns: { roleId: true },
      })
    ).map((r) => r.roleId);
    const roles = await db.query.roleTable.findMany({
      where: inArray(roleTable.id, roleIds),
      columns: { description: false },
    });
    return createSuccessResult(roles);
  } catch (error) {
    console.log(error);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
