import approveEnrollmentController from '@/controllers/enrollment/approveEnrollment';
import createQueueEnrollmentController from '@/controllers/enrollment/createEnrollmentInQueue';
import deleteEnrollmentController from '@/controllers/enrollment/deleteEnrollment';
import editEnrollmentController from '@/controllers/enrollment/editEnrollment';
import getEnrollmentController from '@/controllers/enrollment/getEnrollment';
import getEnrollmentsController from '@/controllers/enrollment/getEnrollmentList';
import getEnrollmentQueuesController from '@/controllers/enrollment/getEnrollmentQueueList';
import type { HonoApp } from '@/models/app.model';
import { approveEnrollmentRouteDef } from '@/openapi/enrollment/approveEnrollment';
import { createQueueEnrollmentRouteDef } from '@/openapi/enrollment/createEnrollmentInQueue';
import { deleteEnrollmentRouteDef } from '@/openapi/enrollment/deleteEnrollment';
import { editEnrollmentRouteDef } from '@/openapi/enrollment/editEnrollment';
import { getEnrollmentInfoRouteDef } from '@/openapi/enrollment/getEnrollment';
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

  // Le tre rotte sotto erano definite in openapi/ ma non registrate qui e senza
  // controller: il client le chiamava e riceveva 404. Sono quelle che servono a
  // modificare e cancellare un'iscrizione.
  router.openapi(getEnrollmentInfoRouteDef, getEnrollmentController);
  router.openapi(editEnrollmentRouteDef, editEnrollmentController);
  router.openapi(deleteEnrollmentRouteDef, deleteEnrollmentController);
};
