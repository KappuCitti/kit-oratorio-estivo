import createSchoolController from '@/controllers/school/createSchool';
import getSchoolsController from '@/controllers/school/getSchoolList';
import type { HonoApp } from '@/models/app.model';
import { createSchoolRouteDef } from '@/openapi/school/createSchool';
import { getSchoolListRouteDef } from '@/openapi/school/getSchools';

export default (router: HonoApp) => {
  router.openapi(getSchoolListRouteDef, getSchoolsController);
  router.openapi(createSchoolRouteDef, createSchoolController);
};
