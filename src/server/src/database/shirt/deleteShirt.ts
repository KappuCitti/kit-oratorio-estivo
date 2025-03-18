import { eq } from 'drizzle-orm';
import { db } from '..';
import { dbLogger } from '../logger';
import { shirtSizeTable } from '../schema';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { HttpStatusCodes } from '@/codes';

export async function deleteShirt(id: number) {
  try {
    const [{ affectedRows }] = await db
      .delete(shirtSizeTable)
      .where(eq(shirtSizeTable.id, id));
    return affectedRows > 0
      ? createSuccessResult(null)
      : createErrorResult(HttpStatusCodes.NOT_FOUND);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
