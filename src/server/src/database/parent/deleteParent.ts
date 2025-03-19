import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '../logger';
import { HttpStatusCodes } from '@/codes';
import { db } from '..';
import { parentTable } from '../schema';
import { eq } from 'drizzle-orm';

export async function deleteParent(id: number) {
  try {
    const [{ affectedRows }] = await db
      .delete(parentTable)
      .where(eq(parentTable.id, id));
    return affectedRows > 0
      ? createSuccessResult(null)
      : createErrorResult(HttpStatusCodes.NOT_FOUND);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
