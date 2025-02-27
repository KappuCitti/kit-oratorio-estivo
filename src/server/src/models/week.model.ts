import { weekTable } from '@/database/schema';
import { createSelectSchema } from 'drizzle-zod';

export const weekSchema = createSelectSchema(weekTable);
