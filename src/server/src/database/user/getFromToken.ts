import { and, eq, sql } from 'drizzle-orm';
import { db } from '..';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { HttpStatusCodes } from '@/codes';
import { dbLogger } from '../logger';
import { sessionTable } from '../schema/session';
import { usersTable } from '../schema/user';

export async function getUserFromToken(token: string) {
  try {
    const session = await db.query.sessions.findFirst({
      columns: { userId: true },
      where: and(
        eq(sessionTable.token, token),
        sql`${sessionTable.expires} > NOW()`
      ),
    });
    if (!session) return createErrorResult(HttpStatusCodes.UNAUTHORIZED);
    const user = await db.query.users.findFirst({
      columns: { password: false },
      where: eq(usersTable.id, session.userId),
    });
    if (!user) return createErrorResult(HttpStatusCodes.UNAUTHORIZED);
    return createSuccessResult(user);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
