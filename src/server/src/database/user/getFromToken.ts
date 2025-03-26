import { and, eq, sql } from 'drizzle-orm';
import { db } from '..';
import { sessionTable, usersTable } from '../schema';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import type { FullUser } from '@/models/user.model';
import { getUserRoles } from '../role/getUserRoles';
import { getUserPermissions } from '../permissions/getUserPermissions';
import { HttpStatusCodes } from '@/codes';
import { dbLogger } from '../logger';

export async function getUserFromToken(token: string) {
  try {
    const session = await db.query.sessionTable.findFirst({
      columns: { userId: true },
      where: and(
        eq(sessionTable.token, token),
        sql`${sessionTable.expires} > NOW()`
      ),
    });
    if (!session) return createErrorResult(HttpStatusCodes.UNAUTHORIZED);
    const user = await db.query.usersTable.findFirst({
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
    const roles = await getUserRoles(user.id);
    if (!roles.success) return roles;
    const permissions = await getUserPermissions(user.id);
    if (!permissions.success) return permissions;
    user.roles = roles.data;
    user.permissions = permissions.data;
    return createSuccessResult(user);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
