import { HttpStatusCodes } from '@/codes';
import { can } from '@/middlewares/hasPermission';
import { cfSchema } from '@/models/common.model';
import {
  createJsonResBody,
  createRequiredJsonBody,
} from '@/utils/createOpenApiBody';
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

/**
 * Il genitore decide, per ciascun ragazzo che gestisce, se il ragazzo vede i
 * prezzi e lo stato dei pagamenti delle proprie settimane.
 */
export const setShowPaymentsRouteDef = createRoute({
  tags: ['User'],
  method: 'put',
  path: '/users/{id}/payments-visibility',
  middleware: can('manage_self_child_users'),
  request: {
    params: z.object({ id: cfSchema }),
    body: createRequiredJsonBody(
      z.object({ showPayments: z.boolean() }),
      'Whether the managed person can see prices and payments'
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonResBody(true, z.null(), 'Setting saved'),
    [HttpStatusCodes.FORBIDDEN]: createJsonResBody(
      false,
      z.string(),
      'The person is not managed by the user'
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonResBody(
      false,
      z.string(),
      'Error while talking to database'
    ),
  },
});

export type SetShowPaymentsRoute = typeof setShowPaymentsRouteDef;
