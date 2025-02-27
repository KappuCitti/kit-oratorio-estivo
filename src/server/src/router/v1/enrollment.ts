import deleteEnrollmentController from '@/controllers/enrollment/deleteEnrollment';
import getEnrollmentController from '@/controllers/enrollment/getEnrollment';
import getEnrollmentsController from '@/controllers/enrollment/getEnrollmentList';
import type { HonoApp } from '@/models/app.model';
import { deleteEnrollmentRouteDef } from '@/openapi/enrollment/deleteEnrollment';
import { getEnrollmentInfoRouteDef } from '@/openapi/enrollment/getEnrollment';
import { getEnrollmentListRouteDef } from '@/openapi/enrollment/getEnrollments';

export default (router: HonoApp) => {
  router.openapi(getEnrollmentListRouteDef, getEnrollmentsController);
  router.openapi(getEnrollmentInfoRouteDef, getEnrollmentController);
  router.openapi(deleteEnrollmentRouteDef, deleteEnrollmentController);
};
