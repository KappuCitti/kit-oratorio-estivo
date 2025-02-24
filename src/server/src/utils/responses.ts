import type { Context } from 'hono';
import { createErrorResult, createSuccessResult } from './createResult';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { HttpStatusCodes } from '@/codes';

export function httpErrorResponse<
  C extends Context,
  S extends ContentfulStatusCode
>(c: C, status: S, message?: string) {
  let finalMessage;
  switch (status) {
    case HttpStatusCodes.OK:
      finalMessage = 'OK';
      break;
    case HttpStatusCodes.BAD_REQUEST:
      finalMessage = 'Bad request';
      break;
    case HttpStatusCodes.UNAUTHORIZED:
      finalMessage = 'Unauthorized';
      break;
    case HttpStatusCodes.FORBIDDEN:
      finalMessage = 'Forbidden';
      break;
    case HttpStatusCodes.NOT_FOUND:
      finalMessage = 'Not found';
      break;
    case HttpStatusCodes.CONFLICT:
      finalMessage = 'Conflict';
      break;
    case HttpStatusCodes.INTERNAL_SERVER_ERROR:
      finalMessage = 'Internal server error';
      break;
    case HttpStatusCodes.NOT_IMPLEMENTED:
      finalMessage = 'Not implemented';
      break;
    default:
      finalMessage = 'Internal server error';
  }
  return c.json(createErrorResult(message || finalMessage), status);
}

export function httpSuccessResponse<C extends Context, D>(c: C, data: D) {
  return c.json(createSuccessResult(data), 200);
}
