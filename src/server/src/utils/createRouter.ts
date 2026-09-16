import { HttpStatusCodes } from '@/codes';
import type { Bindings } from '@/models/app.model';
import { OpenAPIHono } from '@hono/zod-openapi';
import { parseZodError } from './parseZodError';
import { httpErrorResponse } from './responses';

/**
 * Sta in un modulo a parte, e non dentro createApp.ts, per non creare un ciclo
 * di import: i file in router/ registrano le rotte al caricamento del modulo e
 * hanno bisogno di questa funzione, mentre createApp.ts ha bisogno di loro.
 * Con tutto nello stesso file, `createRouter` sarebbe ancora indefinita nel
 * momento in cui i file di rotta provano a chiamarla.
 */
export function createRouter() {
  return new OpenAPIHono<Bindings>({
    strict: false,
    defaultHook: (result, c) => {
      if (!result.success) {
        return httpErrorResponse(
          c,
          HttpStatusCodes.UNPROCESSABLE_ENTITY,
          parseZodError(result.error)
        );
      }
    },
  });
}
