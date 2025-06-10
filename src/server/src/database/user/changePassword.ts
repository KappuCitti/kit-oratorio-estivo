import { HttpStatusCodes } from '@/codes';
import { createErrorResult } from '@/utils/createResult';
import { db } from '..';
import { and, eq, gt } from 'drizzle-orm';
import { hashPassword } from '@/utils/password';
import { sessionTable } from '../schema/session';
import { usersTable } from '../schema/user';
import { now } from '../utils/now';
import { DatabaseError } from '@/errors/database';

export async function changePassword(
  token: string,
  oldPassword: string,
  newPassword: string
) {
  const session = await db.query.sessions.findFirst({
    where: and(eq(sessionTable.token, token), gt(sessionTable.expires, now())),
  });
  const userId = session!.userId;
  const [user] = await db.query.users.findMany({
    where: eq(usersTable.id, userId),
    limit: 1,
  });
  const validPassword = await Bun.password.verify(oldPassword, user.password);
  if (!validPassword)
    throw new DatabaseError(HttpStatusCodes.UNAUTHORIZED, 'invalid_password');
  await db
    .update(usersTable)
    .set({ password: await hashPassword(newPassword) })
    .where(eq(usersTable.id, userId));
}
