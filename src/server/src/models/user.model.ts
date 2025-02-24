import { usersTable, roleTable } from '@/database/schema';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const fullUserSchema = createSelectSchema(usersTable)
  .omit({ password: true })
  .extend({
    roles: z.array(createSelectSchema(roleTable).omit({ description: true })),
    permissions: z.array(
      createSelectSchema(roleTable).omit({ description: true })
    ),
  });

export type FullUser = z.infer<typeof fullUserSchema>;

export const bareUserSchema = createSelectSchema(usersTable)
  .omit({
    password: true,
    theme: true,
  })
  .extend({
    roles: z.array(createSelectSchema(roleTable).omit({ description: true })),
  });

export type BareUser = z.infer<typeof bareUserSchema>;
