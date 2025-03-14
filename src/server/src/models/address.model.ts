import { addressTable } from '@/database/schema';
import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

export const addressSchema = createSelectSchema(addressTable);

export type Address = z.infer<typeof addressSchema>;
