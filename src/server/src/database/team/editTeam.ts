import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '../logger';
import { HttpStatusCodes } from '@/codes';
import { db } from '..';
import { count, eq, inArray } from 'drizzle-orm';
import { childTable, enrollmentTable, teamTable } from '../schema';

type ChildField = {
  type: 'SET' | 'ADD';
  ids: number[];
};

export async function editTeam(
  id: number,
  name?: string,
  color?: string,
  child?: ChildField
) {
  try {
    const teamExists = !!(await db.query.teamTable.findFirst({
      where: eq(teamTable.id, id),
    }));
    if (!teamExists) {
      return createErrorResult(HttpStatusCodes.NOT_FOUND);
    }
    if (child) {
      const [childs] = await db
        .select({
          count: count(),
        })
        .from(childTable)
        .where(inArray(childTable.id, child?.ids));
      if (childs.count !== child?.ids.length)
        return createErrorResult(HttpStatusCodes.BAD_REQUEST);
      if (child.type === 'SET') {
        await db
          .update(enrollmentTable)
          .set({
            teamId: null,
          })
          .where(eq(enrollmentTable.teamId, id));
        await db
          .update(enrollmentTable)
          .set({ teamId: id })
          .where(inArray(enrollmentTable.childId, child.ids));
      } else {
        await db
          .update(enrollmentTable)
          .set({ teamId: id })
          .where(inArray(enrollmentTable.childId, child.ids));
      }
    }
    const updates: {
      [key in 'name' | 'color']?: string;
    } = {};
    if (name) {
      const exists = !!(await db.query.teamTable.findFirst({
        where: eq(teamTable.name, name),
      }));
      if (exists) {
        return createErrorResult(HttpStatusCodes.CONFLICT);
      }
      updates.name = name;
    }
    if (color) updates.color = color;
    await db.update(teamTable).set(updates).where(eq(teamTable.id, id));
    return createSuccessResult(null);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
