import { HttpStatusCodes } from '@/codes';
import { createEnrollment } from '@/database/enrollment/createEnrollment';
import type { RouteController } from '@/models/app.model';
import type { CreateQueueEnrollmentRoute } from '@/openapi/enrollment/createEnrollmentInQueue';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';
import { getCookie } from 'hono/cookie';

const createQueueEnrollmentController: RouteController<
  CreateQueueEnrollmentRoute
> = async (c) => {
  const {
    schoolId,
    classId,
    dataProcessingConsent,
    exitAuthorization,
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
    exitAuthorization,
    schoolId,
    classId,
    weeks,
    specialDiet,
    parentNotes,
    shirt
  );
  if (!enrollment.success) {
    switch (enrollment.error) {
      case HttpStatusCodes.BAD_REQUEST:
        return httpErrorResponse(
          c,
          enrollment.error,
          'One or more ids are invalid'
        );
      case HttpStatusCodes.FORBIDDEN:
        return httpErrorResponse(c, enrollment.error, 'Invalid user');
      case HttpStatusCodes.CONFLICT:
        return httpErrorResponse(
          c,
          enrollment.error,
          'Child is already enrolled for the year or year is invalid'
        );
      default:
        return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  return httpSuccessResponse(c, enrollment.data);
};

export default createQueueEnrollmentController;
