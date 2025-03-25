import { HttpStatusCodes } from '@/codes';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '../logger';
import { db } from '..';
import { attendanceTable } from '../schema';
import { eq } from 'drizzle-orm';

export async function deleteAttedance(id: number) {
  try {
    const [{ affectedRows }] = await db
      .delete(attendanceTable)
      .where(eq(attendanceTable.id, id));
    return affectedRows > 0
      ? createSuccessResult(null)
      : createErrorResult(HttpStatusCodes.NOT_FOUND);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
