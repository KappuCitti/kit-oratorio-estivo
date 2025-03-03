import { HttpStatusCodes } from '@/codes';
import { createEnrollment } from '@/database/enrollment/createEnrollment';
import type { RouteController } from '@/models/app.model';
import type { CreateEnrollmentRoute } from '@/openapi/enrollment/createEnrollment';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const createEnrollmentController: RouteController<
  CreateEnrollmentRoute
> = async (c) => {
  const {
    child,
    className,
    section,
    year,
    weeks,
    team,
    shirt,
    parentNotes,
    managerNotes,
    dataProcessingConsent,
    exitAuthorization,
    schoolType,
  } = await c.req.valid('json');
  const res = await createEnrollment(
    child,
    weeks,
    dataProcessingConsent,
    exitAuthorization,
    schoolType,
    className,
    section,
    year,
    team,
    shirt,
    parentNotes,
    managerNotes
  );
  if (!res.success) {
    switch (res.error) {
      case HttpStatusCodes.BAD_REQUEST:
        return httpErrorResponse(c, res.error, 'One or more ids are invalid');
      default:
        return httpErrorResponse(c, res.error);
    }
  }
  return httpSuccessResponse(c, res.data);
};

export default createEnrollmentController;
