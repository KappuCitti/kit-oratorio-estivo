import { HttpStatusCodes } from '@/codes';
import { approveEnrollment } from '@/database/enrollment/approveEnrollment';
import type { RouteController } from '@/models/app.model';
import type { ApproveEnrollmentRoute } from '@/openapi/enrollment/approveEnrollment';
import { httpErrorResponse, httpSuccessResponse } from '@/utils/responses';

const approveEnrollmentController: RouteController<
  ApproveEnrollmentRoute
> = async (c) => {
  const { queueId, managerNotes, section, weeks, teamId } = await c.req.valid(
    'json'
  );
  const enrollment = await approveEnrollment(
    queueId,
    section,
    weeks,
    teamId,
    managerNotes
  );
  if (!enrollment.success) {
    switch (enrollment.error) {
      case HttpStatusCodes.BAD_REQUEST:
        return httpErrorResponse(
          c,
          enrollment.error,
          'One or more ids are invalid'
        );
      case HttpStatusCodes.NOT_FOUND:
        return httpErrorResponse(
          c,
          enrollment.error,
          'Enrollment queue not found'
        );
      default:
        return httpErrorResponse(c, HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  return httpSuccessResponse(c, enrollment.data);
};

export default approveEnrollmentController;
