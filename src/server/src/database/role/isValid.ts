import { count, eq } from 'drizzle-orm';
import { db } from '..';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { HttpStatusCodes } from '@/codes';
import { dbLogger } from '../logger';
import { roleTable } from '../schema/role';

export async function isValidRole(roleId: number) {
  try {
    const [rows] = await db
      .select({ count: count() })
      .from(roleTable)
      .where(eq(roleTable.id, roleId));
    return createSuccessResult(rows.count > 0);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
