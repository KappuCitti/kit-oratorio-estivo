import getEnrollmentsController from '@/controllers/enrollment/getEnrollmentList';
import type { HonoApp } from '@/models/app.model';
import { getEnrollmentListRouteDef } from '@/openapi/enrollment/getEnrollments';

export default (router: HonoApp) => {
  router.openapi(getEnrollmentListRouteDef, getEnrollmentsController);
  // router.openapi(getEnrollmentInfoRouteDef, getEnrollmentController);
  // router.openapi(deleteEnrollmentRouteDef, deleteEnrollmentController);
  // router.openapi(createEnrollmentRouteDef, createEnrollmentController);
  // router.openapi(editEnrollmentRouteDef, editEnrollmentController);
};
