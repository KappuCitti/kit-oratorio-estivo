import getPeopleController from '@/controllers/people/getPeople';
import type { HonoApp } from '@/models/app.model';
import { getPeopleRouteDef } from '@/openapi/people/getPeople';

export default (router: HonoApp) => {
  router.openapi(getPeopleRouteDef, getPeopleController);
};
