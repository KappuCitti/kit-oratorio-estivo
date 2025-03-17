import { z } from 'zod';
import { weekEnrollmentSchema } from './week.model';
import { CLASSES } from './class.model';
import { SCHOOL_TYPES } from './schoolTypes.model';
import { fullChildSchema } from './children.model';
import { fullParentSchema } from './parent.model';
import { bodyAddressSchema } from './address.model';

export const bodyFamilyEnrollmentSchema = z.object({
  team: z.union([z.number().int().positive(), z.null()]).optional(),
  shirt: z.union([z.number().int().positive(), z.null()]).optional(),
  weeks: z.array(weekEnrollmentSchema),
  dataProcessingConsent: z.boolean(),
  exitAuthorization: z.boolean(),
  schoolType: z.enum(SCHOOL_TYPES),
  className: z.enum(CLASSES),
  section: z.string().max(1, 'Section must be 1 character long'),
  year: z.number().int().positive(),
  parentNotes: z
    .union([z.string().max(255, 'Max parent notes size reached'), z.null()])
    .optional(),
  managerNotes: z
    .union([z.string().max(255, 'Max manager notes size reached'), z.null()])
    .optional(),
});
export type BodyFamilyEnrollment = z.infer<typeof bodyFamilyEnrollmentSchema>;

export const bodyFamilyChildSchema = fullChildSchema
  .omit({
    id: true,
    address: true,
  })
  .extend({
    address: bodyAddressSchema,
    enrollments: z.array(bodyFamilyEnrollmentSchema),
  });
export type BodyFamilyChild = z.infer<typeof bodyFamilyChildSchema>;

export const bodyFamilyParentSchema = fullParentSchema.omit({
  id: true,
});
export type BodyFamilyParent = z.infer<typeof bodyFamilyParentSchema>;

export const bodyFamilySchema = z.object({
  childs: z.array(bodyFamilyChildSchema),
  parents: z.array(bodyFamilyParentSchema),
});
export type BodyFamily = z.infer<typeof bodyFamilySchema>;
