import approveEnrollmentController from '@/controllers/enrollment/approveEnrollment';
import createQueueEnrollmentController from '@/controllers/enrollment/createEnrollmentInQueue';
import getEnrollmentsController from '@/controllers/enrollment/getEnrollmentList';
import getEnrollmentQueuesController from '@/controllers/enrollment/getEnrollmentQueueList';
import type { HonoApp } from '@/models/app.model';
import { approveEnrollmentRouteDef } from '@/openapi/enrollment/approveEnrollment';
import { createQueueEnrollmentRouteDef } from '@/openapi/enrollment/createEnrollmentInQueue';
import { getEnrollmentQueueListRouteDef } from '@/openapi/enrollment/getEnrollmentQueues';
import { getEnrollmentListRouteDef } from '@/openapi/enrollment/getEnrollments';

export default (router: HonoApp) => {
  router.openapi(getEnrollmentListRouteDef, getEnrollmentsController);
  router.openapi(approveEnrollmentRouteDef, approveEnrollmentController);
  router.openapi(
    createQueueEnrollmentRouteDef,
    createQueueEnrollmentController
  );
  router.openapi(getEnrollmentQueueListRouteDef, getEnrollmentQueuesController);
};
