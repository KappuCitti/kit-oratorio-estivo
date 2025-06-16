import { and, eq, gt } from 'drizzle-orm';
import { db } from '..';
import { HttpStatusCodes } from '@/codes';
import { sessionTable } from '../schema/session';
import { usersTable } from '../schema/user';
import { DatabaseError } from '@/errors/database';
import { now } from '../utils/now';

export async function getUserFromToken(token: string) {
  const session = await db.query.sessions.findFirst({
    columns: { userId: true },
    where: and(eq(sessionTable.token, token), gt(sessionTable.expires, now())),
  });
  if (!session)
    throw new DatabaseError(HttpStatusCodes.UNAUTHORIZED, 'invalid_token');
  const user = await db.query.users.findFirst({
    columns: { password: false },
    where: eq(usersTable.id, session.userId),
  });
  if (!user)
    throw new DatabaseError(HttpStatusCodes.UNAUTHORIZED, 'invalid_token');
  return user;
}
