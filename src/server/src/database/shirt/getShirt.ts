import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '../logger';
import { HttpStatusCodes } from '@/codes';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { shirtSizeTable } from '../schema/shirt';

export async function getShirt(id: number) {
  try {
    const shirt = await db.query.shirts.findFirst({
      where: eq(shirtSizeTable.id, id),
    });
    return createSuccessResult(shirt);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
