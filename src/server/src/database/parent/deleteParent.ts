import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '../logger';
import { HttpStatusCodes } from '@/codes';
import { db } from '..';
import { childParentTable, childTable, parentTable } from '../schema';
import { eq, inArray } from 'drizzle-orm';

export async function deleteParent(id: number, deleteChildren: boolean) {
  try {
    const [{ affectedRows }] = await db
      .delete(parentTable)
      .where(eq(parentTable.id, id));
    if (affectedRows > 0) {
      const subQuery = db
        .select()
        .from(childParentTable)
        .where(eq(childParentTable.parentId, id))
        .as('childParentTable');
      await db
        .delete(childTable)
        .where(inArray(childTable.id, subQuery.childId));
      return createSuccessResult(null);
    }
    return createErrorResult(HttpStatusCodes.NOT_FOUND);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
