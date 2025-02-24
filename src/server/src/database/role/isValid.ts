import { count, eq } from 'drizzle-orm';
import { db } from '..';
import { userRoleTable } from '../schema';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { HttpStatusCodes } from '@/codes';

export async function isValidRole(roleId: number) {
  try {
    const [rows] = await db
      .select({ count: count() })
      .from(userRoleTable)
      .where(eq(userRoleTable.roleId, roleId));
    return createSuccessResult(rows.count > 0);
  } catch (e) {
    console.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
