import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { hashPassword } from '@/utils/password';
import { HttpStatusCodes } from '@/codes';
import { dbLogger } from '../logger';
import { usersTable } from '../schema/user';
import { personalInfoTable } from '../schema/personalInfo';
import { getRoleIdIfCanRegister } from '../role/canRoleRegister';

export async function register(
  cf: string,
  name: string,
  surname: string,
  password: string,
  role: string,
  email: string | null = null
) {
  try {
    const exists = !!(await db.query.user.findFirst({
      where: eq(usersTable.id, cf),
    }));
    if (exists) return createErrorResult(HttpStatusCodes.CONFLICT);
    await db.insert(personalInfoTable).values({
      id: cf,
      name,
      surname,
    });
    const roleId = await getRoleIdIfCanRegister(role);
    if (!roleId.success) {
      return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
    if (!roleId.data) {
      return createErrorResult(HttpStatusCodes.FORBIDDEN);
    }
    await db.insert(usersTable).values({
      id: cf,
      roleId: roleId.data,
      email: email,
      password: await hashPassword(password),
      theme: 'System',
    });
    return createSuccessResult(HttpStatusCodes.OK);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
