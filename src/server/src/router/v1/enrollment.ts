import approveEnrollmentController from '@/controllers/enrollment/approveEnrollment';
import createQueueEnrollmentController from '@/controllers/enrollment/createEnrollmentInQueue';
import deleteEnrollmentController from '@/controllers/enrollment/deleteEnrollment';
import editEnrollmentController from '@/controllers/enrollment/editEnrollment';
import getEnrollmentController from '@/controllers/enrollment/getEnrollment';
import getEnrollmentsController from '@/controllers/enrollment/getEnrollmentList';
import getEnrollmentQueuesController from '@/controllers/enrollment/getEnrollmentQueueList';
import { approveEnrollmentRouteDef } from '@/openapi/enrollment/approveEnrollment';
import { createQueueEnrollmentRouteDef } from '@/openapi/enrollment/createEnrollmentInQueue';
import { deleteEnrollmentRouteDef } from '@/openapi/enrollment/deleteEnrollment';
import { editEnrollmentRouteDef } from '@/openapi/enrollment/editEnrollment';
import { getEnrollmentInfoRouteDef } from '@/openapi/enrollment/getEnrollment';
import { getEnrollmentQueueListRouteDef } from '@/openapi/enrollment/getEnrollmentQueues';
import { getEnrollmentListRouteDef } from '@/openapi/enrollment/getEnrollments';
import { createRouter } from '@/utils/createRouter';

export default createRouter()
  .openapi(getEnrollmentListRouteDef, getEnrollmentsController)
  .openapi(approveEnrollmentRouteDef, approveEnrollmentController)
  .openapi(createQueueEnrollmentRouteDef, createQueueEnrollmentController)
  .openapi(getEnrollmentQueueListRouteDef, getEnrollmentQueuesController)
  // Le tre rotte sotto erano definite in openapi/ ma non registrate e senza
  // controller: il client le chiamava e riceveva 404. Sono quelle che servono a
  // leggere, modificare e cancellare un'iscrizione.
  .openapi(getEnrollmentInfoRouteDef, getEnrollmentController)
  .openapi(editEnrollmentRouteDef, editEnrollmentController)
  .openapi(deleteEnrollmentRouteDef, deleteEnrollmentController);
