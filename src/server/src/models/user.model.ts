import { roleTable } from '@/database/schema/role';
import { usersTable } from '@/database/schema/user';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { PERMISSIONS } from './permissions.model';
import { personalInfoTable } from '@/database/schema/personalInfo';
import { phoneSchema, idSchema, type Prettify } from './common.model';
import { addressTable } from '@/database/schema/address';

// `theme` resta incluso: questo schema descrive GET /users/self, cioe' i dati
// dell'utente stesso. Omettendolo, la pagina profilo non poteva mostrare il
// tema salvato e il suo menu restava sempre su "System", pur esistendo la
// colonna sul database e la rotta PUT /user/theme per cambiarlo.
// bareUserSchema invece continua a ometterlo: il tema altrui non serve a nessuno.
export const fullUserSchema = createSelectSchema(usersTable)
  .omit({ password: true, roleId: true })
  .extend({
    role: createSelectSchema(roleTable).extend({
      permissions: z.array(z.enum(PERMISSIONS)),
    }),
  })
  .and(
    createSelectSchema(personalInfoTable)
      .omit({ id: true, addressId: true })
      .extend({
        address: createSelectSchema(addressTable).omit({ id: true }).nullable(),
      })
  );
export type FullUser = Prettify<z.infer<typeof fullUserSchema>>;

export const bareUserSchema = createSelectSchema(usersTable)
  .omit({
    password: true,
    theme: true,
    roleId: true,
  })
  .extend({
    role: createSelectSchema(roleTable),
  })
  .and(
    createSelectSchema(personalInfoTable).omit({ id: true, addressId: true })
  );
export type BareUser = z.infer<typeof bareUserSchema>;

export const adminCreateUserSchema = z.object({
  cf: z.string().length(16),
  password: z.string().min(8),
  name: z.string().min(2).max(255),
  surname: z.string().min(2).max(255),
  email: z.string().email().optional(),
  phoneNumber: phoneSchema.optional(),
  birthDate: z.string().date(),
  birthPlace: z.string().min(2).max(255),
  gender: z.enum(['M', 'F']),
  address: z.object({
    street: z.string().min(2).max(255),
    city: z.string().min(2).max(255),
    postalCode: z.string().min(2).max(255),
    country: z.string().min(2).max(255),
  }),
  role: idSchema,
  managers: z.array(
    z.union([
      z.string().length(16),
      z.object({
        cf: z.string().length(16),
        password: z.string().min(8),
        name: z.string().min(2).max(255),
        surname: z.string().min(2).max(255),
        email: z.string().email(),
        phoneNumber: phoneSchema,
        birthDate: z.string().date(),
        birthPlace: z.string().min(2).max(255),
        gender: z.enum(['M', 'F']),
        address: z.object({
          street: z.string().min(2).max(255),
          city: z.string().min(2).max(255),
          postalCode: z.string().min(2).max(255),
          country: z.string().min(2).max(255),
        }),
        role: idSchema,
      }),
    ])
  ),
});
export type AdminCreateUser = z.infer<typeof adminCreateUserSchema>;
