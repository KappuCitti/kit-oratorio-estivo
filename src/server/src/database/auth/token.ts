import { createSuccessResult } from '@/utils/createResult';
import { query } from '..';

export async function isValidToken(token: string) {
  const res = await query<{
    count: number;
  }>`SELECT COUNT(*) as count FROM Session WHERE Token = ${token} AND Expires > NOW()`;
  if (!res.success) return res;
  return createSuccessResult(res.data[0].count > 0);
}
