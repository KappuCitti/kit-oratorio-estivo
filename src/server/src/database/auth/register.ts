import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { db } from '..';
import { count, sql } from 'drizzle-orm';
import { userRoleTable, usersTable } from '../schema';
import { hashPassword } from '@/utils/password';
import { HttpStatusCodes } from '@/codes';

export async function register(
  name: string,
  surname: string,
  password: string,
  roleId: number,
  email: string | null = null
) {
  try {
    const [rows] = await db
      .select({ count: count() })
      .from(usersTable)
      .where(
        sql`(${usersTable.name} = ${name.toLowerCase()} AND ${
          usersTable.surname
        } = ${surname.toLowerCase()}) OR (${usersTable.email} != NULL AND ${
          usersTable.email
        } = ${email})`
      );
    if (rows.count > 0) return createErrorResult(HttpStatusCodes.CONFLICT);
    const passwordHash = await hashPassword(password);
    const [inserted] = await db
      .insert(usersTable)
      .values({
        name,
        surname,
        password: passwordHash,
        email,
      })
      .$returningId();
    await db.insert(userRoleTable).values({
      userId: inserted.id,
      roleId,
    });
    return createSuccessResult(HttpStatusCodes.OK);
  } catch (e) {
    console.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
