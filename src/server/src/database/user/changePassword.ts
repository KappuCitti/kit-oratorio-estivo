import { HttpStatusCodes } from '@/codes';
import { createErrorResult } from '@/utils/createResult';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { sessionTable, usersTable } from '../schema';
import { hashPassword } from '@/utils/password';

export async function changePassword(
  token: string,
  oldPassword: string,
  newPassword: string
) {
  try {
    const session = await db.query.sessionTable.findFirst({
      where: eq(sessionTable.token, token),
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
    console.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
