import type { Theme } from '@/models/theme.model';
import { db } from '..';
import { and, eq, gt } from 'drizzle-orm';
import { sessionTable } from '../schema/session';
import { usersTable } from '../schema/user';
import { now } from '../utils/now';

export async function changeUserTheme(token: string, theme: Theme) {
  const session = await db.query.sessions.findFirst({
    where: and(eq(sessionTable.token, token), gt(sessionTable.expires, now())),
  });
  await db
    .update(usersTable)
    .set({ theme })
    .where(eq(usersTable.id, session!.userId));
}
