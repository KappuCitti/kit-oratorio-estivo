import { db } from '@/database';
import { eq } from 'drizzle-orm';
import { sessionTable } from '../schema/session';

export async function logout(token: string) {
  await db.delete(sessionTable).where(eq(sessionTable.token, token));
}
