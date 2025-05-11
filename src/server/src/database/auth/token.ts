import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { db } from '..';
import { and, count, eq, sql } from 'drizzle-orm';
import { HttpStatusCodes } from '@/codes';
import { dbLogger } from '../logger';
import { sessionTable } from '../schema/session';

export async function isValidToken(token: string) {
  try {
    const exists = !!(await db.query.session.findFirst({
      where: and(
        eq(sessionTable.token, token),
        sql`${sessionTable.expires} > NOW()`
      ),
    }));
    return createSuccessResult(exists);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
