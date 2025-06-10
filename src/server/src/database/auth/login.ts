import { db } from '@/database';
import { eq, or } from 'drizzle-orm';
import { HttpStatusCodes } from '@/codes';
import { dbLogger } from '../logger';
import { usersTable } from '../schema/user';
import { sessionTable } from '../schema/session';
import { DatabaseError } from '@/errors/database';

export async function login(username: string, password: string) {
  dbLogger.debug('Searching user', username);
  const [user] = await db
    .select({
      id: usersTable.id,
      password: usersTable.password,
    })
    .from(usersTable)
    .where(or(eq(usersTable.email, username), eq(usersTable.id, username)));
  dbLogger.debug('Searched user %o', user);
  if (!user)
    throw new DatabaseError(HttpStatusCodes.UNAUTHORIZED, 'invalid_username');
  dbLogger.debug('Checking password');
  const isSame = await Bun.password.verify(password, user.password);
  dbLogger.debug('Password checked %s', isSame);
  if (!isSame)
    throw new DatabaseError(HttpStatusCodes.UNAUTHORIZED, 'invalid_password');
  dbLogger.debug('Creating session');
  const [session] = await db
    .insert(sessionTable)
    .values({
      token: crypto.randomUUID(),
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      userId: user.id,
    })
    .$returningId();
  dbLogger.debug('Session created', session);
  return session.token;
}
