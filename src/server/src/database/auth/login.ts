import { execute, query } from '..';
import { createSuccessResult } from '@/utils/createResult';

export async function login(username: string, password: string) {
  const userRes = await query<{
    id: number;
    password: string;
  }>`SELECT ID as id, Password as password FROM User WHERE CONCAT(Surname, ".", Name) = ${username}`;
  if (!userRes.success) return userRes;
  const user = userRes.data[0];
  const isSame = await Bun.password.verify(password, user.password);
  if (!isSame) return createSuccessResult(null);
  const uuid = crypto.randomUUID();
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await execute`INSERT INTO Session (Token, Expires, UserID) VALUES (${uuid}, ${expires}, ${user.id})`;
  return createSuccessResult(uuid);
}
