import { shirtSizeTable } from '@/database/schema/shirt';
import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

export const shirtSchema = createSelectSchema(shirtSizeTable);
export type Shirt = z.infer<typeof shirtSchema>;

export const bodyShirtSchema = shirtSchema.omit({
  id: true,
});