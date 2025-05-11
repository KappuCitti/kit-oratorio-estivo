import { roleTable } from '@/database/schema/role';
import { usersTable } from '@/database/schema/user';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { PERMISSIONS } from './permissions.model';
import { personalInfoTable } from '@/database/schema/personalInfo';

export const fullUserSchema = createSelectSchema(usersTable)
  .omit({ password: true })
  .extend({
    role: createSelectSchema(roleTable).omit({ description: true }),
    permissions: z.array(z.enum(PERMISSIONS)),
  })
  .and(createSelectSchema(personalInfoTable).omit({ id: true }));

export type FullUser = z.infer<typeof fullUserSchema>;

export const bareUserSchema = createSelectSchema(usersTable)
  .omit({
    password: true,
    theme: true,
  })
  .extend({
    role: createSelectSchema(roleTable).omit({ description: true }),
  });

export type BareUser = z.infer<typeof bareUserSchema>;
