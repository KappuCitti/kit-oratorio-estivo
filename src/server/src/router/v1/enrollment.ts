import createEnrollmentController from '@/controllers/enrollment/createEnrollment';
import deleteEnrollmentController from '@/controllers/enrollment/deleteEnrollment';
import editEnrollmentController from '@/controllers/enrollment/editEnrollment';
import getEnrollmentController from '@/controllers/enrollment/getEnrollment';
import getEnrollmentsController from '@/controllers/enrollment/getEnrollmentList';
import type { HonoApp } from '@/models/app.model';
import { createEnrollmentRouteDef } from '@/openapi/enrollment/createEnrollment';
import { deleteEnrollmentRouteDef } from '@/openapi/enrollment/deleteEnrollment';
import { editEnrollmentRouteDef } from '@/openapi/enrollment/editEnrollment';
import { getEnrollmentInfoRouteDef } from '@/openapi/enrollment/getEnrollment';
import { getEnrollmentListRouteDef } from '@/openapi/enrollment/getEnrollments';

export default (router: HonoApp) => {
  router.openapi(getEnrollmentListRouteDef, getEnrollmentsController);
  //@ts-expect-error Type instantiation is excessively deep and possibly infinite.
  router.openapi(getEnrollmentInfoRouteDef, getEnrollmentController);
  router.openapi(deleteEnrollmentRouteDef, deleteEnrollmentController);
  router.openapi(createEnrollmentRouteDef, createEnrollmentController);
  router.openapi(editEnrollmentRouteDef, editEnrollmentController);
};
