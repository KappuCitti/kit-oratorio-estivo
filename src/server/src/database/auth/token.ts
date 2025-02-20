import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { db } from '..';
import { sessionTable } from '../schema';
import { count, sql } from 'drizzle-orm';

export async function isValidToken(token: string) {
  try {
    const [res] = await db
      .select({ count: count() })
      .from(sessionTable)
      .where(
        sql`${sessionTable.token} = ${token} AND ${sessionTable.expires} > NOW()`
      );
    return createSuccessResult(res.count > 0);
  } catch (e) {
    console.error(e);
    return createErrorResult('Internal server error');
  }
}
