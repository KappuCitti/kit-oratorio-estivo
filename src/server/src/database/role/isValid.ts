import { count, eq } from 'drizzle-orm';
import { db } from '..';
import { roleTable } from '../schema/role';

export async function isValidRole(roleId: number) {
  const [rows] = await db
    .select({ count: count() })
    .from(roleTable)
    .where(eq(roleTable.id, roleId));
  return rows.count > 0;
}
