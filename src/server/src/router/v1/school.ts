import createSchoolController from '@/controllers/school/createSchool';
import getSchoolsController from '@/controllers/school/getSchoolList';
import { createSchoolRouteDef } from '@/openapi/school/createSchool';
import { getSchoolListRouteDef } from '@/openapi/school/getSchools';
import { createRouter } from '@/utils/createRouter';

export default createRouter()
  .openapi(getSchoolListRouteDef, getSchoolsController)
  .openapi(createSchoolRouteDef, createSchoolController);
