import { HttpStatusCodes } from '@/codes';
import { createEnrollment } from '@/database/enrollment/createEnrollment';
import type { RouteController } from '@/models/app.model';
import type { CreateEnrollmentRoute } from '@/openapi/enrollment/createEnrollment';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';
import { getCookie } from 'hono/cookie';

const createEnrollmentController: RouteController<
  CreateEnrollmentRoute
> = async (c) => {
  const {
    schoolType,
    className,
    dataProcessingConsent,
    exitAuthorization,
    imageProcessingConsent,
    user,
    weeks,
    managerNotes,
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
    schoolType,
    className,
    weeks,
    specialDiet,
    managerNotes,
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

export default createEnrollmentController;
