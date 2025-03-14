import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '../logger';
import { HttpStatusCodes } from '@/codes';
import { db } from '..';
import { childTable } from '../schema';
import { eq } from 'drizzle-orm';

export async function deleteChild(id: number) {
  try {
    const [{ affectedRows }] = await db
      .delete(childTable)
      .where(eq(childTable.id, id));
    return affectedRows > 0
      ? createSuccessResult(null)
      : createErrorResult(HttpStatusCodes.NOT_FOUND);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
