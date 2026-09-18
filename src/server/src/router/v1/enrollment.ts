import approveEnrollmentController from '@/controllers/enrollment/approveEnrollment';
import createEnrollmentAsAdminController from '@/controllers/enrollment/createEnrollmentAsAdmin';
import createQueueEnrollmentController from '@/controllers/enrollment/createEnrollmentInQueue';
import deleteEnrollmentController from '@/controllers/enrollment/deleteEnrollment';
import deleteQueueEnrollmentController from '@/controllers/enrollment/deleteQueueEnrollment';
import editEnrollmentController from '@/controllers/enrollment/editEnrollment';
import getEnrollmentController from '@/controllers/enrollment/getEnrollment';
import getEnrollmentsController from '@/controllers/enrollment/getEnrollmentList';
import getEnrollmentQueuesController from '@/controllers/enrollment/getEnrollmentQueueList';
import getManagedEnrollmentsController from '@/controllers/enrollment/getManagedEnrollments';
import getOwnEnrollmentController from '@/controllers/enrollment/getOwnEnrollment';
import {
  getManagedEnrollmentsRouteDef,
  getOwnEnrollmentRouteDef,
} from '@/openapi/enrollment/getManagedEnrollments';
import { approveEnrollmentRouteDef } from '@/openapi/enrollment/approveEnrollment';
import { createEnrollmentAsAdminRouteDef } from '@/openapi/enrollment/createEnrollmentAsAdmin';
import { createQueueEnrollmentRouteDef } from '@/openapi/enrollment/createEnrollmentInQueue';
import { deleteEnrollmentRouteDef } from '@/openapi/enrollment/deleteEnrollment';
import { deleteQueueEnrollmentRouteDef } from '@/openapi/enrollment/deleteQueueEnrollment';
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
  .openapi(deleteQueueEnrollmentRouteDef, deleteQueueEnrollmentController)
  // La vista del genitore: lo stato delle proprie persone.
  .openapi(getManagedEnrollmentsRouteDef, getManagedEnrollmentsController)
  // La vista del ragazzo: la propria iscrizione.
  .openapi(getOwnEnrollmentRouteDef, getOwnEnrollmentController)
  // Le tre rotte sotto erano definite in openapi/ ma non registrate e senza
  // controller: il client le chiamava e riceveva 404. Sono quelle che servono a
  // leggere, modificare e cancellare un'iscrizione.
  .openapi(getEnrollmentInfoRouteDef, getEnrollmentController)
  .openapi(editEnrollmentRouteDef, editEnrollmentController)
  .openapi(deleteEnrollmentRouteDef, deleteEnrollmentController)
  // Creazione diretta, per lo sportello: la coda e' il percorso del genitore,
  // ma un amministratore non puo' usarla al posto suo perche' quella pretende
  // che chi invia gestisca il ragazzo.
  .openapi(createEnrollmentAsAdminRouteDef, createEnrollmentAsAdminController);
