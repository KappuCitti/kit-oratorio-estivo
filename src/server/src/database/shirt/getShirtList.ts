import { HttpStatusCodes } from '@/codes';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { db } from '..';

export async function getShirtList() {
  try {
    const shirts = await db.query.shirtSizeTable.findMany();
    return createSuccessResult(shirts);
  } catch (e) {
    console.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
