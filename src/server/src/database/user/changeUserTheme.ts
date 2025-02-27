import { HttpStatusCodes } from '@/codes';
import type { Theme } from '@/models/theme.model';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { db } from '..';
import { and, eq, sql } from 'drizzle-orm';
import { sessionTable, usersTable } from '../schema';

export async function changeUserTheme(token: string, theme: Theme) {
  try {
    const session = await db.query.sessionTable.findFirst({
      where: and(
        eq(sessionTable.token, token),
        sql`${sessionTable.expires} > NOW()`
      ),
    });
    if (!session) return createErrorResult(HttpStatusCodes.UNAUTHORIZED);
    await db
      .update(usersTable)
      .set({ theme })
      .where(eq(usersTable.id, session.userId));
    return createSuccessResult(HttpStatusCodes.OK);
  } catch (e) {
    console.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
