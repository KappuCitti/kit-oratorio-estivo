import { and, eq, like, or } from 'drizzle-orm';
import { db } from '..';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { HttpStatusCodes } from '@/codes';
import type { Gender } from '@/models/gender.model';
import { parentTable } from '../schema';
import { dbLogger } from '../logger';

export async function getParents(
  page: number,
  pageSize: number,
  query: string = '',
  gender?: Gender
) {
  try {
    const filters = query
      .split(' ')
      .filter((s) => s.trim().length > 0)
      .map((s) =>
        or(
          like(parentTable.name, `%${s}%`),
          like(parentTable.surname, `%${s}%`)
        )
      );
    if (gender) filters.push(eq(parentTable.gender, gender));
    const childs = await db.query.parentTable.findMany({
      columns: {
        email: false,
        phoneNumber: false,
      },
      where: filters.length > 0 ? and(...filters) : undefined,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    return createSuccessResult(childs);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
