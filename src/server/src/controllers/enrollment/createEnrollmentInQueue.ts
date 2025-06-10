import { createEnrollment } from '@/database/enrollment/createQueueEnrollment';
import type { RouteController } from '@/models/app.model';
import type { CreateQueueEnrollmentRoute } from '@/openapi/enrollment/createEnrollmentInQueue';
import { httpSuccessResponse } from '@/utils/responses';
import { getCookie } from 'hono/cookie';

const createQueueEnrollmentController: RouteController<
  CreateQueueEnrollmentRoute
> = async (c) => {
  const {
    classId,
    dataProcessingConsent,
    imageProcessingConsent,
    user,
    weeks,
    parentNotes,
    shirt,
    specialDiet,
  } = await c.req.valid('json');
  const token = (await getCookie(c, 'user_token')) as string;
  const enrollment = await createEnrollment(
    token,
    user,
    dataProcessingConsent,
    imageProcessingConsent,
    classId,
    weeks,
    specialDiet,
    parentNotes,
    shirt
  );
  return httpSuccessResponse(c, enrollment);
};

export default createQueueEnrollmentController;
