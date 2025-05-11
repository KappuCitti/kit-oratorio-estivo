import { HttpStatusCodes } from '@/codes';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { db } from '@/database';
import { eq } from 'drizzle-orm';
import { dbLogger } from '../logger';
import { sessionTable } from '../schema/session';

export async function logout(token: string) {
  try {
    await db.delete(sessionTable).where(eq(sessionTable.token, token));
    return createSuccessResult(HttpStatusCodes.OK);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
