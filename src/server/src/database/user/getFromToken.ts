import type { UserTable } from '@/models/user.model';
import { query } from '..';
import { createSuccessResult } from '@/utils/createResult';

export async function getUserFromToken(token: string) {
  const res =
    await query<UserTable>`SELECT ID as id, Name as name, Surname as surname, Email as email, Theme as theme FROM User WHERE ID IN (SELECT UserID FROM Session WHERE Token = ${token})`;
  if (!res.success) return res;
  return createSuccessResult(res.data[0]);
}
