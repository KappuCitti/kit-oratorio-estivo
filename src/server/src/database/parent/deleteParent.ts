import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '../logger';
import { HttpStatusCodes } from '@/codes';
import { db } from '..';
import { childParentTable, childTable, parentTable } from '../schema';
import { count, eq, inArray, sql } from 'drizzle-orm';

export async function deleteParent(id: number, deleteChildrens: boolean) {
  try {
    const [rows] = await db
      .select({ count: count() })
      .from(parentTable)
      .where(eq(parentTable.id, id))
      .execute();
    if (rows.count > 0) {
      if (deleteChildrens) {
        await db
          .delete(childTable)
          .where(
            inArray(
              childTable.id,
              sql`${db
                .select({ childId: childParentTable.childId })
                .from(childParentTable)
                .where(eq(childParentTable.parentId, id))}`
            )
          );
      }
      await db.delete(parentTable).where(eq(parentTable.id, id));
      return createSuccessResult(null);
    }
    return createErrorResult(HttpStatusCodes.NOT_FOUND);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
