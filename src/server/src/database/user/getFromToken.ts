import { eq } from 'drizzle-orm';
import { db } from '..';
import { sessionTable, usersTable } from '../schema';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import type { FullUser } from '@/models/user.model';
import { getUserRoles } from '../role/getUserRoles';
import { getUserPermissions } from '../permissions/getUserPermissions';
import { HttpStatusCodes } from '@/codes';

export async function getUserFromToken(token: string) {
  try {
    const [{ userId }] = await db
      .select({ userId: sessionTable.userId })
      .from(sessionTable)
      .where(eq(sessionTable.token, token));

    const user = await db.query.usersTable.findFirst({
      columns: { password: false },
      where: eq(usersTable.id, userId),
    });
    if (!user) return createSuccessResult(null);
    return createSuccessResult(user);
  } catch (e) {
    console.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function getUserWithPermissionsFromToken(token: string) {
  try {
    const userRes = await getUserFromToken(token);
    if (!userRes.success) return userRes;
    const user: FullUser = userRes.data as FullUser;
    if (!user) return createSuccessResult(null);
    const roles = await getUserRoles(user.id);
    if (!roles.success) return roles;
    const permissions = await getUserPermissions(user.id);
    if (!permissions.success) return permissions;
    user.roles = roles.data;
    user.permissions = permissions.data;
    return createSuccessResult(user);
  } catch (e) {
    console.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
