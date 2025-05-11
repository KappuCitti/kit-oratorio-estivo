import { db } from '@/database';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { eq, or } from 'drizzle-orm';
import strftime from 'strftime';
import { HttpStatusCodes } from '@/codes';
import { dbLogger } from '../logger';
import { usersTable } from '../schema/user';
import { sessionTable } from '../schema/session';

export async function login(username: string, password: string) {
  try {
    dbLogger.debug('Searching user', username);
    const [user] = await db
      .select({
        id: usersTable.id,
        password: usersTable.password,
      })
      .from(usersTable)
      .where(or(eq(usersTable.email, username), eq(usersTable.id, username)));
    dbLogger.debug('Searched user %o', user);
    if (!user) return createErrorResult(401);
    dbLogger.debug('Checking password');
    const isSame = await Bun.password.verify(password, user.password);
    dbLogger.debug('Password checked %s', isSame);
    if (!isSame) return createErrorResult(401);
    // const expires = strftime(
    //   '%Y-%m-%d %H:%M:%S',
    //   new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    // );
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
    return createSuccessResult(session.token);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
