import { HttpStatusCodes } from '@/codes';
import { editEnrollment } from '@/database/enrollment/editEnrollment';
import type { RouteController } from '@/models/app.model';
import type { EditEnrollmentRoute } from '@/openapi/enrollment/editEnrollment';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const editEnrollmentController: RouteController<EditEnrollmentRoute> = async (
  c
) => {
  const { id } = await c.req.valid('param');
  const {
    className,
    section,
    year,
    weeks,
    teamId,
    shirtSizeId,
    parentNotes,
    managerNotes,
    dataProcessingConsent,
    exitAuthorization,
    schoolType,
  } = await c.req.valid('json');
  const res = await editEnrollment(
    id,
    weeks,
    dataProcessingConsent,
    exitAuthorization,
    schoolType,
    className,
    section,
    year,
    teamId,
    shirtSizeId,
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
  return httpSuccessResponse(c, null);
};

export default editEnrollmentController;
