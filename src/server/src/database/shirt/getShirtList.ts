import { HttpStatusCodes } from '@/codes';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { db } from '..';
import { dbLogger } from '../logger';

export async function getShirtList() {
  try {
    const shirts = await db.query.shirtSizeTable.findMany();
    return createSuccessResult(shirts);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
