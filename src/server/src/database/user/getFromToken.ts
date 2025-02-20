import { sql } from 'drizzle-orm';
import { db } from '..';
import { sessionTable } from '../schema';
import { createSuccessResult } from '@/utils/createResult';

export async function getUserFromToken(token: string) {
  try {
    const [{ userId }] = await db
      .select({ userId: sessionTable.userId })
      .from(sessionTable)
      .where(sql`${sessionTable.token} = ${token}`);

    const user = await db.query.usersTable.findFirst({
      columns: { password: false },
      where: (users, { eq }) => eq(users.id, userId),
    });
    if (!user) return createSuccessResult(null);
    return createSuccessResult(user);
  } catch (e) {
    console.error(e);
    return createSuccessResult(null);
  }
}
