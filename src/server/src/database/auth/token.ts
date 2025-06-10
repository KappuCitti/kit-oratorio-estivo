import { db } from '..';
import { and, eq, sql } from 'drizzle-orm';
import { sessionTable } from '../schema/session';

export async function isValidToken(token: string) {
  const exists = !!(await db.query.sessions.findFirst({
    where: and(
      eq(sessionTable.token, token),
      sql`${sessionTable.expires} > NOW()`
    ),
  }));
  return exists;
}
