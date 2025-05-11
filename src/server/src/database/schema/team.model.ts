import { createSelectSchema } from 'drizzle-zod';
import { teamTable } from './team';
import type { z } from 'zod';

export const teamSchema = createSelectSchema(teamTable);
export type Team = z.infer<typeof teamSchema>;

export const bodyTeamSchema = teamSchema.omit({
  id: true,
});
