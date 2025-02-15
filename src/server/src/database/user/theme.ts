import type { Theme } from '@/models/theme.model';
import { query } from '..';
import { createSuccessResult } from '@/utils/createResult';

export async function getUserTheme(userId: number) {
  const res = await query<{
    theme: Theme;
  }>`SELECT Theme as theme FROM User WHERE ID = ${userId}`;
  if (!res.success) return res;
  return createSuccessResult(res.data[0].theme);
}
