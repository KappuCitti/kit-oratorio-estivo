import type { InferResponseType } from 'hono/client';
import { api } from '../services/api-client';

/**
 * Una settimana di oratorio estivo, come la restituisce GET /weeks.
 *
 * Non e' piu' scritta a mano. La versione precedente dichiarava le quattro
 * date come `Date`, mentre sul filo viaggiano come stringhe: Drizzle le
 * tipizza `Date` lato server, ma JSON non ha un tipo data. Il codice che
 * faceva `new Date(w.startDate)` funzionava per caso, quello che avesse
 * chiamato un metodo di Date su quei campi sarebbe esploso a runtime.
 */
type WeeksResponse = InferResponseType<typeof api.weeks.$get, 200>;

type Week = Extract<WeeksResponse, { success: true }>['data'][number];

export default Week;
