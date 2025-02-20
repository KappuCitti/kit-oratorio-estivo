import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { db } from '..';
import { count, sql } from 'drizzle-orm';
import { usersTable } from '../schema';
import { hashPassword } from '@/utils/password';

export async function register(
  name: string,
  surname: string,
  password: string,
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
    if (rows.count > 0) return createErrorResult(409);
    const passwordHash = await hashPassword(password);
    await db.insert(usersTable).values({
      name,
      surname,
      password: passwordHash,
      email,
    });
    return createSuccessResult(200);
  } catch (e) {
    console.error(e);
    return createErrorResult(500);
  }
}
