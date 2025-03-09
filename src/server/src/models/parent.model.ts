import { parentTable } from '@/database/schema';
import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

export const parentSchema = createSelectSchema(parentTable).omit({
  email: true,
  phoneNumber: true,
});

export type Parent = z.infer<typeof parentSchema>;
