import { teamTable } from '@/database/schema';
import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

export const teamSchema = createSelectSchema(teamTable);

export type Team = z.infer<typeof teamSchema>;
