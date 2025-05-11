import { and, eq, sql } from 'drizzle-orm';
import { db } from '..';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import type { FullUser } from '@/models/user.model';
import { getUserPermissions } from '../permissions/getUserPermissions';
import { HttpStatusCodes } from '@/codes';
import { dbLogger } from '../logger';
import { sessionTable } from '../schema/session';
import { usersTable } from '../schema/user';
import { roleTable } from '../schema/role';

export async function getUserFromToken(token: string) {
  try {
    const session = await db.query.sessions.findFirst({
      columns: { userId: true },
      where: and(
        eq(sessionTable.token, token),
        sql`${sessionTable.expires} > NOW()`
      ),
    });
    if (!session) return createErrorResult(HttpStatusCodes.UNAUTHORIZED);
    const user = await db.query.users.findFirst({
      columns: { password: false },
      where: eq(usersTable.id, session.userId),
    });
    if (!user) return createErrorResult(HttpStatusCodes.UNAUTHORIZED);
    return createSuccessResult(user);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function getUserWithPermissionsFromToken(token: string) {
  try {
    const userRes = await getUserFromToken(token);
    if (!userRes.success) return userRes;
    const user: FullUser = userRes.data as FullUser;
    if (!user) return createErrorResult(HttpStatusCodes.UNAUTHORIZED);
    const permissions = await getUserPermissions(user.id);
    if (!permissions.success) return permissions;
    user.role = (
      await db.query.roles.findMany({
        where: eq(roleTable.id, user.roleId),
      })
    )[0];
    user.permissions = permissions.data;
    return createSuccessResult(user);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
