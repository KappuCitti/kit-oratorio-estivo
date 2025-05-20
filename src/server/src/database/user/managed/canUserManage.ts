import { HttpStatusCodes } from '@/codes';
import { db } from '@/database';
import { dbLogger } from '@/database/logger';
import { managesTable } from '@/database/schema/manages';
import { rolePermissionTable } from '@/database/schema/rolePermission';
import { sessionTable } from '@/database/schema/session';
import { usersTable } from '@/database/schema/user';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { and, eq, gt } from 'drizzle-orm';

export async function canUserManageFromToken(token: string, targetId: string) {
  try {
    const [result] = await db
      .select({ userId: usersTable.id })
      .from(usersTable)
      .innerJoin(sessionTable, eq(usersTable.id, sessionTable.userId))
      .innerJoin(
        rolePermissionTable,
        eq(usersTable.roleId, rolePermissionTable.roleId)
      )
      .where(
        and(
          eq(sessionTable.token, token),
          gt(sessionTable.expires, new Date()),
          eq(rolePermissionTable.permission, 'manage_self_child_users')
        )
      )
      .limit(1);
    if (!result) return createSuccessResult(false);
    const targets = await db
      .select()
      .from(managesTable)
      .where(
        and(
          eq(managesTable.mainId, result.userId),
          eq(managesTable.targetId, targetId)
        )
      );
    return createSuccessResult(targets.length > 0);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
