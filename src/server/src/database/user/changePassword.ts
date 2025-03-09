import { HttpStatusCodes } from '@/codes';
import { createErrorResult } from '@/utils/createResult';
import { db } from '..';
import { and, eq, sql } from 'drizzle-orm';
import { sessionTable, usersTable } from '../schema';
import { hashPassword } from '@/utils/password';
import { dbLogger } from '../logger';

export async function changePassword(
  token: string,
  oldPassword: string,
  newPassword: string
) {
  try {
    const session = await db.query.sessionTable.findFirst({
      where: and(
        eq(sessionTable.token, token),
        sql`${sessionTable.expires} > NOW()`
      ),
    });
    if (!session) return createErrorResult(HttpStatusCodes.UNAUTHORIZED);
    const userId = session.userId;
    const [user] = await db.query.usersTable.findMany({
      where: eq(usersTable.id, userId),
      limit: 1,
    });
    const validPassword = await Bun.password.verify(oldPassword, user.password);
    if (!validPassword) return createErrorResult(HttpStatusCodes.FORBIDDEN);
    await db
      .update(usersTable)
      .set({ password: await hashPassword(newPassword) })
      .where(eq(usersTable.id, userId));
    return createErrorResult(HttpStatusCodes.OK);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
