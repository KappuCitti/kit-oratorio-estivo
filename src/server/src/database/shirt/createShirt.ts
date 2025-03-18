import { HttpStatusCodes } from '@/codes';
import { dbLogger } from '../logger';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { shirtSizeTable } from '../schema';

export async function createShirt(
  sizeName: string,
  width: string,
  height: string,
  isAvailable?: boolean
) {
  try {
    const exists = !!(await db.query.shirtSizeTable.findFirst({
      where: eq(shirtSizeTable.sizeName, sizeName),
    }));
    if (exists) return createErrorResult(HttpStatusCodes.CONFLICT);
    const [{ id }] = await db
      .insert(shirtSizeTable)
      .values({
        sizeName,
        width,
        height,
        isAvailable: isAvailable ?? true,
      })
      .$returningId();
    return createSuccessResult(id);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
