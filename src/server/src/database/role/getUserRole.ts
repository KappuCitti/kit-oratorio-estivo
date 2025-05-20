import { HttpStatusCodes } from '@/codes';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '../logger';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { usersTable } from '../schema/user';

export async function getUserRole(userId: string) {
  try {
    const role = await db.query.users.findFirst({
      columns: { roleId: true },
      where: eq(usersTable.id, userId),
    });
    if (!role) return createErrorResult(HttpStatusCodes.NOT_FOUND);
    return createSuccessResult(role.roleId);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
