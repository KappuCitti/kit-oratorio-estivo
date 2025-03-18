import { HttpStatusCodes } from '@/codes';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '../logger';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { shirtSizeTable } from '../schema';

export async function editShirt(
  id: number,
  sizeName?: string,
  width?: string,
  height?: string,
  isAvailable?: boolean
) {
  try {
    const validId = !!(await db.query.shirtSizeTable.findFirst({
      where: eq(shirtSizeTable.id, id),
    }));
    if (!validId) return createErrorResult(HttpStatusCodes.NOT_FOUND);

    if (sizeName) {
      const alreadyExists = !!(await db.query.shirtSizeTable.findFirst({
        where: eq(shirtSizeTable.sizeName, sizeName),
      }));
      if (alreadyExists) return createErrorResult(HttpStatusCodes.CONFLICT);
    }
    
    await db
      .update(shirtSizeTable)
      .set({
        sizeName,
        width,
        height,
        isAvailable,
      })
      .where(eq(shirtSizeTable.id, id));

    return createSuccessResult(null);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
