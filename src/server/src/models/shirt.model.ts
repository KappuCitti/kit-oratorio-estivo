import { shirtSizeTable } from '@/database/schema';
import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

export const shirtSchema = createSelectSchema(shirtSizeTable);

export type Shirt = z.infer<typeof shirtSchema>;
