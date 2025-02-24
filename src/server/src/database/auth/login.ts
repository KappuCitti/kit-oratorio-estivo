import { db } from '@/database';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { sessionTable, usersTable } from '../schema';
import { sql } from 'drizzle-orm';
import strftime from 'strftime';
import { HttpStatusCodes } from '@/codes';

export async function login(username: string, password: string) {
  try {
    const [user] = await db
      .select({
        id: usersTable.id,
        password: usersTable.password,
      })
      .from(usersTable)
      .where(
        sql`CONCAT(${usersTable.surname}, '.', ${
          usersTable.name
        }) = ${username.toLowerCase()}`
      );
    if (!user) return createSuccessResult(null);
    const isSame = await Bun.password.verify(password, user.password);
    if (!isSame) return createSuccessResult(null);
    const expires = strftime(
      '%Y-%m-%d %H:%M:%S',
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    );
    const [session] = await db
      .insert(sessionTable)
      .values({
        expires,
        userId: user.id,
      })
      .$returningId();
    return createSuccessResult(session.token);
  } catch (e) {
    console.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
