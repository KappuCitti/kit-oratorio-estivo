import { count, eq } from 'drizzle-orm';
import { db } from '..';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { HttpStatusCodes } from '@/codes';
import { roleTable } from '../schema';

export async function isValidRole(roleId: number) {
  try {
    const [rows] = await db
      .select({ count: count() })
      .from(roleTable)
      .where(eq(roleTable.id, roleId));
    return createSuccessResult(rows.count > 0);
  } catch (e) {
    console.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
