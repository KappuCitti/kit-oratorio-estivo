import { createRouter } from '@/utils/createRouter';
import activity from './activity';
import attendance from './attendance';
import auth from './auth';
import _class from './class';
import enrollment from './enrollment';
import main from './main';
import role from './role';
import school from './school';
import shirt from './shirt';
import stats from './stats';
import team from './team';
import user from './user';
import week from './week';

/**
 * Il router della v1: tutti i domini montati alla radice, perche' le
 * definizioni delle rotte portano gia' il percorso completo (`/teams`,
 * `/enrollments/{id}`, ...).
 *
 * Anche qui la catena non va interrotta: `.route()` restituisce un tipo che
 * comprende le rotte del sotto-router, ed e' quel tipo che finisce in
 * `ApiType` e quindi nel client.
 */
export const v1Router = createRouter()
  .route('/', activity)
  .route('/', attendance)
  .route('/', auth)
  .route('/', _class)
  .route('/', enrollment)
  .route('/', main)
  .route('/', role)
  .route('/', school)
  .route('/', shirt)
  .route('/', stats)
  .route('/', team)
  .route('/', user)
  .route('/', week);

/**
 * Il contratto dell'API, consumato dal client via `hc<ApiType>`.
 *
 * E' il tipo del router v1 e non quello dell'applicazione intera perche' il
 * prefisso (`/api`) e' configurabile a runtime da env o da config.toml: non
 * essendo un letterale, montare sotto quel prefisso degraderebbe i percorsi a
 * `string` e farebbe sparire la tipizzazione. Il prefisso resta quindi
 * nell'indirizzo di base che il client passa a `hc`.
 */
export type ApiType = typeof v1Router;

export default v1Router;
