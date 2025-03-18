import { HttpStatusCodes } from '@/codes';
import { hasPermission } from '@/middlewares/hasPermission';
import { paramIdSchema } from '@/models/common.model';
import { fullEnrollmentWithFamilySchema } from '@/models/enrollment.model';
import { createJsonResBody } from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

export const getEnrollmentInfoRouteDef = createRoute({
  tags: ['Enrollment'],
  method: 'get',
  path: '/enrollments/{id}',
  middleware: hasPermission('enrollment_get'),
  request: {
    params: paramIdSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(
      true,
      fullEnrollmentWithFamilySchema,
      'Enrollment informations'
    ),
    [HttpStatusCodes.NOT_FOUND]: createJsonResBody(
      false,
      z.string(),
      'Enrollment not found'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type GetEnrollmentInfoRoute = typeof getEnrollmentInfoRouteDef;
